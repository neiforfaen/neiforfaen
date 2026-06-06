import "./assets/main.css";
import "lenis/dist/lenis.css";

import { createApp } from "vue";
import App from "./App.vue";
import LenisVue from "lenis/vue";

const app = createApp(App);

app.use(LenisVue);
app.mount("#app");
