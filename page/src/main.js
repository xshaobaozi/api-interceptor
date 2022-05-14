import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");

chrome.runtime.onMessage.addListener((event, sender, callable) => {
  console.log("panel addListener", event);
});
