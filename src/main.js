import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/global.css';

// PWA Service Worker Registration
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[PracVault PWA] New content available. Ready to refresh.');
  },
  onOfflineReady() {
    console.log('[PracVault PWA] App cached and ready for offline use.');
  },
  onRegisterError(error) {
    console.warn('[PracVault PWA] Service worker registration error:', error);
  }
});

const app = createApp(App);
app.use(router);
app.mount('#app');
