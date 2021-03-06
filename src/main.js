import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import locale from 'element-plus/es/locale/lang/ru'
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

import iconTools from '@element-plus/icons/es/Tools'
import Expand from '@element-plus/icons/es/Expand'

import VueMask from 'di-vue-mask'

import '@/vdg3/css/style.css'
import '@/vdg3/css/color.css'

window._userId = 13048;
window._token  = '$2y$10$OOyb6fCHwqiaXWRIwKxf1.MA7b7lizXFu8J.0M6XhdJqLM6G.3ipO';

// if (process?.env?.NODE_ENV && process.env.NODE_ENV == 'development')
//     window.userId = 13048
// else window.userId = window._userId
//
// if (process?.env?.NODE_ENV && process.env.NODE_ENV == 'development')
//     window.token = '$2y$10$OOyb6fCHwqiaXWRIwKxf1.MA7b7lizXFu8J.0M6XhdJqLM6G.3ipO'
// else window.token = window._token

createApp(App)
    .component('tools',iconTools)
    .component('expand',Expand)
    .use(router)
    .use(store)
    .use(ElementPlus,  {locale})
    .use(VueMask)
    .mount('#app')
