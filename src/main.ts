import { createApp } from 'vue'
import './style.css'
import Index from "./Index.vue";
import App from './App.vue'
import Scan from './Scan.vue'
import Tags from "./Tags.vue";

import { createMemoryHistory, createRouter } from 'vue-router'
const routes = [
    { path: '/scan', component: Scan },
    { path: '/', component: Index },
    { path: '/tag', component: Tags }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

