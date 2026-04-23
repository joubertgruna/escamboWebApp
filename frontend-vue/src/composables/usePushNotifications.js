import { ref, onMounted } from 'vue';
import { useNotification } from './useNotification';

export function usePushNotifications() {
  const isSupported = ref(false);
  const isSubscribed = ref(false);
  const permission = ref('default');

  const { showSuccess, showError } = useNotification();

  // Verificar suporte a Push Notifications
  const checkSupport = async () => {
    isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window;
    
    if (isSupported.value) {
      permission.value = Notification.permission;
      
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        isSubscribed.value = !!subscription;
      } catch (err) {
        console.error('Erro ao verificar inscrição de push:', err);
      }
    }
    
    return isSupported.value;
  };

  // Solicitar permissão e se inscrever
  const subscribe = async () => {
    try {
      // Solicitar permissão do navegador
      if (Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        permission.value = result;
        
        if (result !== 'granted') {
          showError('Permissão de notificações negada', 'Push Notifications');
          return false;
        }
      } else if (Notification.permission === 'denied') {
        showError('Permissão de notificações foi negada anteriormente', 'Push Notifications');
        return false;
      }

      // Obter registration do service worker
      const registration = await navigator.serviceWorker.ready;
      
      // Criar subscription de push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });

      console.log('✅ Inscrito em push notifications:', subscription);
      isSubscribed.value = true;
      showSuccess('Notificações ativadas!', 'Push Notifications');
      
      // Enviar subscription para o servidor (opcional, para futuros broadcasts)
      await sendSubscriptionToServer(subscription);
      
      return true;
    } catch (err) {
      console.error('Erro ao se inscrever em push:', err);
      showError('Erro ao ativar notificações', 'Push Notifications');
      return false;
    }
  };

  // Desinscrever de push notifications
  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        isSubscribed.value = false;
        showSuccess('Notificações desativadas', 'Push Notifications');
        return true;
      }
    } catch (err) {
      console.error('Erro ao desinscrever de push:', err);
      showError('Erro ao desativar notificações', 'Push Notifications');
      return false;
    }
  };

  // Enviar subscription para o servidor
  const sendSubscriptionToServer = async (subscription) => {
    try {
      const token = localStorage.getItem('escambo_token');
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar subscription');
      }

      console.log('✅ Subscription salva no servidor');
    } catch (err) {
      console.error('Erro ao enviar subscription para servidor:', err);
    }
  };

  // Enviar notificação local (para teste)
  const sendLocalNotification = (title, options = {}) => {
    if (!isSupported.value || !isSubscribed.value) {
      console.warn('Push notifications não suportadas ou não inscritos');
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'escambo-notification',
        requireInteraction: false,
        ...options,
      });
    });
  };

  onMounted(async () => {
    await checkSupport();
  });

  return {
    isSupported,
    isSubscribed,
    permission,
    checkSupport,
    subscribe,
    unsubscribe,
    sendLocalNotification,
  };
}
