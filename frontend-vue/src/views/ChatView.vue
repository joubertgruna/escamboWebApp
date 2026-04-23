<template>
  <div class="chat-view" v-if="matchId">
    <div class="chat-view__header p-3 d-flex align-items-center gap-3">
      <button class="btn btn-sm btn-outline-secondary" @click="$router.back()">←</button>
      <img :src="otherUserAvatar" alt="Avatar" class="chat-view__avatar" />
      <div>
        <h6 class="mb-0">{{ otherUser?.name || 'Carregando...' }}</h6>
        <small v-if="isTyping" class="text-success">digitando...</small>
      </div>
    </div>

    <div class="chat-view__messages" ref="messagesContainer">
      <div v-if="chatStore.loading" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-success"></div>
      </div>

      <ChatBubble
        v-for="msg in chatStore.messages"
        :key="msg.id"
        :message="msg"
        :current-user-id="authStore.user?.id"
        @retry="() => handleRetry(msg)"
      />

      <p v-if="!chatStore.loading && chatStore.messages.length === 0" class="text-center text-muted py-4">
        Nenhuma mensagem ainda. Diga olá! 👋
      </p>
    </div>

    <ChatInput @send="handleSend" @typing="handleTyping" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';
import { useMatchesStore } from '@/stores/matches';
import { useSocket } from '@/composables/useSocket';
import { useNotification } from '@/composables/useNotification';
import { useChatNotifications } from '@/composables/useChatNotifications';
import ChatBubble from '@/components/chat/ChatBubble.vue';
import ChatInput from '@/components/chat/ChatInput.vue';

const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();
const matchesStore = useMatchesStore();
const { connect, disconnect, joinChat, leaveChat, sendMessage: socketSend, onMessage, emitTyping } = useSocket();
const { showError, showSuccess } = useNotification();
const { notifyNewMessage } = useChatNotifications();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const matchId = computed(() => route.params.matchId);
const messagesContainer = ref(null);
const isTyping = ref(false);
const otherUser = ref(null);
const pollInterval = ref(null);

const otherUserAvatar = computed(() => {
  const url = otherUser.value?.avatar_url;
  if (!url) return '/default-avatar.png';
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
});

let typingTimer = null;

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Polling fallback para mensagens
const pollMessages = async () => {
  try {
    await chatStore.fetchMessages(matchId.value);
    scrollToBottom();
  } catch (err) {
    console.error('Erro ao fazer polling de mensagens:', err);
  }
};

onMounted(async () => {
  try {
    const match = await matchesStore.fetchMatch(matchId.value);
    const myId = authStore.user?.id;
    otherUser.value = match.user1?.id === myId ? match.user2 : match.user1;
  } catch (err) {
    console.error('Erro ao buscar match:', err);
  }

  // Carregar mensagens iniciais
  await chatStore.fetchMessages(matchId.value);
  
  // Conectar ao Socket.io
  console.log('🔌 Conectando ao Socket.io...');
  connect();
  
  // Entrar na sala de chat
  joinChat(matchId.value);
  
  scrollToBottom();

  // Listener para mensagens em tempo real via Socket
  onMessage((msg) => {
    console.log('📨 Nova mensagem recebida via Socket:', msg);
    chatStore.addMessage(msg);
    
    // Se a mensagem foi recebida de outro usuário, enviar notificação
    if (msg.sender_id !== authStore.user?.id) {
      console.log('🔔 Notificando nova mensagem de', otherUser.value?.name);
      notifyNewMessage(msg, otherUser.value, otherUserAvatar.value, {
        playSound: true,
        showToast: true,
        showPush: true,
      });
    }
    
    scrollToBottom();
  });

  // Polling fallback: buscar mensagens a cada 3 segundos
  // Isso garante que mensagens sejam carregadas mesmo se o WebSocket falhar
  pollInterval.value = setInterval(() => {
    console.log('🔄 Fazendo polling de mensagens...');
    pollMessages();
  }, 3000);

  console.log('✅ Chat iniciado. Socket: conectando, Polling: ativo a cada 3s');
});

onUnmounted(() => {
  leaveChat(matchId.value);
  disconnect();
  
  // Limpar o polling
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
    console.log('🛑 Polling de mensagens interrompido');
  }
});

watch(() => chatStore.messages.length, scrollToBottom);

const handleSend = async (content) => {
  try {
    console.log('📤 Enviando mensagem:', { matchId: matchId.value, content });
    
    // Enviar via API (o backend fará broadcast automático via Socket.io)
    await chatStore.sendMessage(matchId.value, content);
    console.log('✅ Mensagem enviada com sucesso');
    showSuccess('Mensagem enviada!');
    
    scrollToBottom();
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || 'Erro desconhecido';
    console.error('❌ Erro ao enviar mensagem:', err);
    console.error('Detalhes:', err.response?.data || err.message);
    showError(errorMsg, 'Erro ao enviar');
  }
};

const handleTyping = (typing) => {
  emitTyping(matchId.value, typing);
  if (typing) {
    isTyping.value = true;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      isTyping.value = false;
    }, 2000);
  } else {
    isTyping.value = false;
  }
};

const handleRetry = async (message) => {
  if (message.status === 'failed') {
    try {
      chatStore.updateMessageStatus(message.id, 'pending');
      const retryCount = (message.retryCount || 0) + 1;
      await chatStore.retryFailedMessage(matchId.value, message.content, retryCount, message.id);
      scrollToBottom();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  }
};
</script>

<style scoped lang="scss">
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    background: white;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }

  &__avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #f8f9fa;
  }
}
</style>
