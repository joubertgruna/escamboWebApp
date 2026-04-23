import { ref } from 'vue';
import { useNotification } from './useNotification';
import { usePushNotifications } from './usePushNotifications';

/**
 * Composable para gerenciar notificações de mensagens no chat
 * Suporta: Toast notifications + Push notifications + Sons
 */
export function useChatNotifications() {
  const { showInfo } = useNotification();
  const { sendLocalNotification, isSubscribed } = usePushNotifications();

  // Reproduzir som de notificação usando Web Audio API
  const playNotificationSound = () => {
    try {
      // Verificar se o navegador suporta Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Criar uma simples sequência de notas (tipo "ding")
      const now = audioContext.currentTime;
      
      // Nota 1: 800Hz por 100ms
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      
      osc1.frequency.value = 800;
      osc1.type = 'sine';
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      osc1.start(now);
      osc1.stop(now + 0.1);
      
      // Nota 2: 1000Hz por 100ms (pequeno delay)
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      
      osc2.frequency.value = 1000;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      osc2.start(now + 0.05);
      osc2.stop(now + 0.15);
      
      console.log('🔊 Som de notificação reproduzido');
    } catch (err) {
      console.warn('Não foi possível reproduzir som de notificação:', err);
    }
  };

  /**
   * Enviar notificação para uma nova mensagem recebida
   * @param {Object} message - Dados da mensagem
   * @param {Object} otherUser - Dados do outro usuário
   * @param {string} otherUserAvatar - URL do avatar do outro usuário
   * @param {Object} options - Opções adicionais
   */
  const notifyNewMessage = (message, otherUser, otherUserAvatar, options = {}) => {
    const {
      playSound = true,
      showToast = true,
      showPush = true,
    } = options;

    const senderName = otherUser?.name || 'Novo contato';
    const messagePreview = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');

    console.log('🔔 Enviando notificações para mensagem de', senderName);

    // 1. Toast notification (sempre funciona)
    if (showToast) {
      showInfo(`${senderName}: ${messagePreview}`, '💬 Mensagem recebida');
    }

    // 2. Push notification (se inscrever)
    if (showPush && isSubscribed.value) {
      try {
        sendLocalNotification(
          `Nova mensagem de ${senderName}`,
          {
            body: messagePreview,
            icon: otherUserAvatar || '/icons/icon-192x192.png',
            badge: '/favicon.ico',
            tag: 'chat-notification',
            requireInteraction: false,
            actions: [
              {
                action: 'open',
                title: 'Abrir',
              },
              {
                action: 'close',
                title: 'Fechar',
              },
            ],
          }
        );
      } catch (err) {
        console.error('Erro ao enviar push notification:', err);
      }
    }

    // 3. Som de notificação
    if (playSound) {
      playNotificationSound();
    }
  };

  /**
   * Notificação de digitação
   */
  const notifyUserTyping = (userName) => {
    console.log('✍️ Notificando que', userName, 'está digitando');
    // Pode adicionar efeito visual ou som aqui
  };

  /**
   * Notificação de usuário online/offline
   */
  const notifyUserStatus = (userName, isOnline) => {
    const status = isOnline ? 'conectado' : 'desconectado';
    console.log(`📡 ${userName} ${status}`);
    // Pode adicionar notificação discreta aqui
  };

  return {
    notifyNewMessage,
    notifyUserTyping,
    notifyUserStatus,
    playNotificationSound,
  };
}
