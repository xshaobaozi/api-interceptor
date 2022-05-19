import { createApp } from 'vue';
import App from './App.vue';
// import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'jsoneditor/dist/jsoneditor.min.css';
import { createPinia } from 'pinia';

import '@/scss/variables.scss';
import { addListener } from './helper/chrome';
const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
// app.use(router);
app.mount('#app');

addListener((event, sender, callable) => {
  console.log('panel addListener', event);
});
