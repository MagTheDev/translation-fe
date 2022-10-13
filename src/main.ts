import { createApp } from 'vue'
import App from './App.vue'
import './assets/reset.css';
import PhosphorVue from "phosphor-vue"

// Toasts
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css";
// Popup dialogs
import 'gitart-vue-dialog/dist/style.css'
import { GDialog } from 'gitart-vue-dialog'

createApp(App)
    .use(PhosphorVue)
    .use(Toast)
    .component('GDialog', GDialog)
.mount('#app')
