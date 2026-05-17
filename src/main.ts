import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';
import App from './App.vue';
import { i18n } from './i18n';
import './assets/styles/main.css';

createApp(App).use(i18n).use(MotionPlugin).mount('#app');
