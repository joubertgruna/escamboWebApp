import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles/main.scss';

const app = createApp(App);

// Vue Toastification Configuration
const toastOptions = {
  position: 'bottom-right',
  timeout: 4000,
  closeButton: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeOnClick: true,
  icon: true,
  rtl: false,
};

app.use(createPinia());
app.use(router);
app.use(useToast, toastOptions);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('✅ Service Worker registrado com sucesso:', registration);

      // Verificar se há atualizações disponíveis
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('📦 Nova versão do app disponível!');
            // Notificar usuário sobre atualização (opcional)
          }
        });
      });
    } catch (err) {
      console.error('❌ Erro ao registrar Service Worker:', err);
    }
  });
}

// Habilitar PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('💾 PWA install prompt disponível');
  
  // Armazenar para usar quando clicar no botão de instalação
  window.escamboInstallPrompt = deferredPrompt;
});

window.addEventListener('appinstalled', () => {
  console.log('✅ App instalado como PWA!');
  deferredPrompt = null;
  window.escamboInstallPrompt = null;
});

app.mount('#app');
