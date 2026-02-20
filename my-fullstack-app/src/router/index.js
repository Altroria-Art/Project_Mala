import main_user from '../pages/main_user.vue' 
import main_admin from '../pages/main_admin.vue'

const routes = [
  {
    path: '/',
    name: 'main_user',
    component: main_user
  },
  {
    path: '/admin',
    name: 'main_admin',
    component: main_admin
  }
]