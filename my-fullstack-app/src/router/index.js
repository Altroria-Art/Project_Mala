import { createRouter, createWebHistory } from 'vue-router'
import main_user from '../pages/user/main_user.vue' 
import main_admin from '../pages/admin/main_admin.vue'

const routes = [
  { path: '/', name: 'main_user', component: main_user },
  { path: '/admin', name: 'main_admin', component: main_admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router