import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../components/admin/AdminLayout.vue'

import main_user from '../pages/user/main_user.vue'
import main_admin from '../pages/admin/main_admin.vue'
import bills_admin from '../pages/admin/bills_admin.vue'
import products_admin from '../pages/admin/products_admin.vue'
import revenue_admin from '../pages/admin/revenue_admin.vue'
import login_admin from '../pages/admin/login_admin.vue' // 1. Import หน้า login

const routes = [
  { path: '/', name: 'main_user', component: main_user },
  
  // 2. เพิ่ม Route สำหรับหน้า Login (อยู่นอก AdminLayout)
  { path: '/admin/login', name: 'login_admin', component: login_admin },

  {
    path: '/admin',
    component: AdminLayout,
    // 3. ใส่ meta: { requiresAuth: true } เพื่อระบุว่าต้อง login ก่อนเข้า
    meta: { requiresAuth: true }, 
    children: [
      { path: '', name: 'main_admin', component: main_admin },
      { path: 'bills', name: 'bills_admin', component: bills_admin },
      { path: 'products', name: 'products_admin', component: products_admin },
      { path: 'revenue', name: 'revenue_admin', component: revenue_admin }
    ]
  }
]

const router = createRouter({ 
  history: createWebHistory(), 
  routes 
})

// 4. เพิ่ม Route Guard ก่อนเปลี่ยนหน้า
router.beforeEach((to, from, next) => {
  // เช็คว่าหน้าที่กำลังจะไป ต้องล็อกอินไหม
  if (to.meta.requiresAuth) {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isLoggedIn) {
      // ถ้ายังไม่ล็อกอิน ให้เด้งไปหน้า login
      next('/admin/login');
    } else {
      next(); // ล็อกอินแล้ว ไปต่อได้
    }
  } else {
    next(); // หน้าทั่วไป เข้าได้เลย
  }
})

export default router