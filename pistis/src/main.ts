import { createHead } from '@unhead/vue'
import { marked } from 'marked'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { i18n } from '@/plugins/i18n'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/700.css'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()
marked.setOptions({
  breaks: true,
})
app.use(pinia)
app.use(head as unknown as any)
app.use(router)
app.use(i18n)
app.use(vuetify)

app.mount('#app')
document.dispatchEvent(new Event('custom-render-trigger'))
