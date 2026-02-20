import { createRouter, createWebHistory } from 'vue-router'
import main_user from '../pages/user/main_user.vue' 
import main_admin from '../pages/admin/main_admin.vue'
import bills_admin from '../pages/admin/bills_admin.vue'
import products_admin from '../pages/admin/products_admin.vue'
import revenue_admin from '../pages/admin/revenue_admin.vue'

const routes = [
  { path: '/', name: 'main_user', component: main_user },
  { path: '/admin', name: 'main_admin', component: main_admin },
  { path: '/admin/bills', name: 'bills_admin', component: bills_admin },
  { path: '/admin/products', name: 'products_admin', component: products_admin },
  { path: '/admin/revenue', name: 'revenue_admin', component: revenue_admin },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router