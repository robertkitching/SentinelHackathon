import Vue from 'vue'
import VueRouter from 'vue-router'
//import Vuex, { Store } from 'vuex'
//import store from '../store'

Vue.use(VueRouter)

const routes = [
    {
        path: '',
        name: 'main-layout',
        component: () => import('../layouts/Main.vue'),
        children: [
            {
                path: '/',
                name: 'Home',
                component: () => import('../components/MainForm.vue'),
            },
            {
                path: '/incident/:incident/:entity',
                name: 'Incident',
                component: () => import('../components/Rule.vue'),
            },
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    //base: process.env.BASE_URL,
    routes
})


export default router
