<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="text-2xl font-bold mb-6 text-center">Mala Verse Admin</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input v-model="username" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input v-model="password" type="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required>
        </div>
        <button type="submit" class="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const handleLogin = () => {
  // สมมติรหัสผ่านชั่วคราวก่อนต่อ Backend (ควรเปลี่ยนเมื่อมี API จริง)
  if (username.value === 'admin' && password.value === '1234') {
    // บันทึกสถานะการล็อกอินลง localStorage
    localStorage.setItem('isAdminLoggedIn', 'true');
    // เปลี่ยนหน้าไปที่ระบบแอดมิน
    router.push('/admin');
  } else {
    alert('Username หรือ Password ไม่ถูกต้อง!');
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
</style>