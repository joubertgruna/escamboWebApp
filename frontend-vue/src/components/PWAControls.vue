<template>
  <div class="pwa-controls d-flex gap-2 align-items-center">
    <!-- Botão de Instalar PWA -->
    <button
      v-if="showInstallButton"
      class="btn btn-sm btn-success d-flex align-items-center gap-2"
      @click="installApp"
      title="Instalar Escambo como app"
    >
      <i class="bi bi-download"></i>
      <span class="d-none d-sm-inline">Instalar</span>
    </button>

    <!-- Botão de Push Notifications -->
    <button
      v-if="isSupported && !isSubscribed"
      class="btn btn-sm btn-info d-flex align-items-center gap-2"
      @click="enablePushNotifications"
      title="Ativar notificações push"
    >
      <i class="bi bi-bell"></i>
      <span class="d-none d-sm-inline">Notificações</span>
    </button>

    <!-- Botão de Desativar Notificações -->
    <button
      v-if="isSupported && isSubscribed"
      class="btn btn-sm btn-warning d-flex align-items-center gap-2"
      @click="disablePushNotifications"
      title="Desativar notificações push"
    >
      <i class="bi bi-bell-slash"></i>
      <span class="d-none d-sm-inline">Notif. Ativas</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePushNotifications } from '@/composables/usePushNotifications';
import { useNotification } from '@/composables/useNotification';

const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
const { showSuccess, showError } = useNotification();

const showInstallButton = ref(false);

onMounted(async () => {
  // Verificar se o PWA install prompt está disponível
  if (window.escamboInstallPrompt) {
    showInstallButton.value = true;
  }
});

const installApp = async () => {
  try {
    const deferredPrompt = window.escamboInstallPrompt;
    
    if (!deferredPrompt) {
      showError('App já está instalado', 'PWA');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ App instalado com sucesso!');
      showSuccess('App instalado com sucesso!', 'PWA');
      showInstallButton.value = false;
      window.escamboInstallPrompt = null;
    } else {
      console.log('❌ Instalação cancelada pelo usuário');
    }
  } catch (err) {
    console.error('Erro ao instalar app:', err);
    showError('Erro ao instalar app', 'PWA');
  }
};

const enablePushNotifications = async () => {
  const success = await subscribe();
  if (success) {
    console.log('✅ Push notifications ativadas');
  }
};

const disablePushNotifications = async () => {
  const success = await unsubscribe();
  if (success) {
    console.log('✅ Push notifications desativadas');
  }
};
</script>

<style scoped lang="scss">
.pwa-controls {
  button {
    white-space: nowrap;
    font-size: 0.875rem;
    
    i {
      font-size: 1rem;
    }

    &:hover {
      transform: translateY(-1px);
      transition: all 0.2s ease;
    }
  }
}
</style>
