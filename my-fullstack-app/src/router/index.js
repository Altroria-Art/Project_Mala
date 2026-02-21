import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../components/admin/AdminLayout.vue'

// Import หน้าต่างๆ (ตรวจสอบชื่อไฟล์ตัวเล็ก-ใหญ่ให้ตรงกับในเครื่องนะครับ)
import main_user from '../pages/user/main_user.vue'
import main_admin from '../pages/admin/main_admin.vue'
import bills_admin from '../pages/admin/bills_admin.vue'
import products_admin from '../pages/admin/products_admin.vue'
import revenue_admin from '../pages/admin/revenue_admin.vue'

const routes = [
  // หน้า User: จะไม่มี Navbar แอดมินมาปน
  { path: '/', name: 'main_user', component: main_user },

  // กลุ่มหน้า Admin: จะมี Navbar แอดมินอัตโนมัติจาก AdminLayout
  {
    path: '/admin',
    component: AdminLayout,
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

export default router