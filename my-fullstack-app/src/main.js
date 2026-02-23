import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. ต้อง Import Pinia เข้ามา
import './style.css'
import App from './App.vue'       // ตรวจสอบตัวพิมพ์ใหญ่-เล็ก (App.vue) ให้ตรงกับชื่อไฟล์จริงด้วยนะครับ
import router from './router/index.js'

const app = createApp(App)
const pinia = createPinia()        // 2. สร้าง instance ของ Pinia

app.use(pinia)                     // 3. ติดตั้ง Pinia ลงในแอป (ต้องทำก่อน mount)
app.use(router) 

app.mount('#app')