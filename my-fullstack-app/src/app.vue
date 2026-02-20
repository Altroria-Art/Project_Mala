<template>
  <div class="admin-layout">
    <header class="top-header">
      <div class="logo-area">
        <div class="logo-wrapper">
          <img src="./assets/logo.png" alt="Mala Verse Logo" class="logo-img" />
        </div>
        <div class="brand-text">
          <h1 class="brand-title">Mala Verse</h1>
          <p class="brand-subtitle">MALAVERSE HOT POT & GRILL</p>
        </div>
      </div>
    </header>

    <nav class="tabs-nav">
      <div class="nav-links">
        <router-link to="/admin" exact-active-class="active" class="tab">คิวห้องครัว</router-link>
        <router-link to="/admin/bills" exact-active-class="active" class="tab">รวมบิลรายโต๊ะ</router-link>
        <router-link to="/admin/products" exact-active-class="active" class="tab">คลังเมนู</router-link>
        <router-link to="/admin/revenue" exact-active-class="active" class="tab">รายได้</router-link>
      </div>

      <button @click="handleLogout" class="logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logout-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        ออกจากระบบ
      </button>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// ฟังก์ชันออกจากระบบ
const handleLogout = () => {
  if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
    // สามารถใส่ Logic เคลียร์ Token หรือ Session ตรงนี้ได้
    console.log('User logged out');
    router.push('/'); // กลับไปหน้าหลัก (User)
  }
};
</script>

<style>
/* CSS เดิมของคุณวิว และเพิ่มส่วน Logout */
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Prompt:wght@300;400;500;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Prompt', 'Sarabun', sans-serif;
}

.admin-layout {
  min-height: 100vh;
  background-color: #e5e5e5;
  display: flex;
  flex-direction: column;
}

.top-header {
  background: linear-gradient(135deg, #ffb169 0%, #ff8a05 100%);
  padding: 12px 40px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-wrapper {
  width: 55px;
  height: 55px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.5);
}

.logo-img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.brand-title {
  font-family: 'Permanent Marker', cursive;
  font-size: 26px;
  color: #000;
  line-height: 1;
}

.brand-subtitle {
  font-size: 10px;
  color: #c62828;
  font-weight: bold;
}

.tabs-nav {
  background-color: #ffffff;
  padding: 0 40px;
  display: flex;
  justify-content: space-between; /* แยกกลุ่มเมนูกับปุ่มออกจากกัน */
  align-items: center;
  border-bottom: 1px solid #edf2f7;
}

.nav-links {
  display: flex;
  gap: 40px;
}

.tab {
  padding: 18px 5px;
  font-size: 16px;
  font-weight: 500;
  color: #718096;
  text-decoration: none;
  transition: all 0.2s;
  border-bottom: 4px solid transparent;
}

.tab:hover {
  color: #f97316;
}

.tab.active {
  color: #f97316;
  font-weight: 700;
  border-bottom-color: #f97316;
}

/* สไตล์ปุ่มออกจากระบบ */
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #e53e3e;
  border: 1px solid #feb2b2;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #fff5f5;
  border-color: #fc8181;
}

.main-content {
  padding: 30px 40px;
  flex: 1;
}
</style>