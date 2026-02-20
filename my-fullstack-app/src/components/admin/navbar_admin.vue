<template>
  <nav class="w-full h-[65px] bg-white px-4 flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.05)] sticky top-0 z-50">
    
    <router-link to="/admin" class="flex items-center gap-[10px]">
      <div class="w-[50px] h-[50px] flex items-center justify-center">
        <img src="../../assets/logo.png" alt="Mala Verse Logo" class="w-full h-full object-contain" />
      </div>

      <div class="flex items-end gap-2">
        <span class="font-['Permanent_Marker',_cursive] text-[24px] font-bold text-black tracking-[0.03em] mt-[2px]">
          Mala Verse
        </span>
        <span class="text-[14px] font-bold text-[#b00000] mb-[4px]">Admin</span>
      </div>
    </router-link>

    <div class="flex items-center gap-5 mr-1 mt-1">
      
      <button @click="openNotifications" class="relative flex items-center justify-center cursor-pointer bg-transparent border-none p-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-[28px] h-[28px] fill-black">
          <path fill-rule="evenodd" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" clip-rule="evenodd"/>
        </svg>
        
        <span v-if="newOrderCount > 0" class="absolute -top-[6px] -right-[8px] bg-[#b00000] text-white text-[10px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none">
          {{ newOrderCount }}
        </span>
      </button>

      <button @click="openAdminProfile" class="relative flex items-center justify-center cursor-pointer bg-transparent border-none p-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-[28px] h-[28px] fill-black">
          <path fill-rule="evenodd" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 8v2h16v-2c0-5.33-2.67-8-8-8z" clip-rule="evenodd" />
        </svg>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. สร้างตัวแปรแบบ Reactive เพื่อเก็บตัวเลขแจ้งเตือนออเดอร์ใหม่
const newOrderCount = ref(0);

// 2. ฟังก์ชันสำหรับเปิดการแจ้งเตือน
const openNotifications = () => {
  console.log('คลิกเปิดแจ้งเตือนออเดอร์ใหม่');
  // 📌 เพิ่มโค้ดสำหรับเปิด Pop-up แจ้งเตือนแอดมินที่นี่
};

// ฟังก์ชันสำหรับเปิดโปรไฟล์/ตั้งค่า/ล็อกเอาต์
const openAdminProfile = () => {
  console.log('คลิกเปิดเมนูโปรไฟล์ Admin');
  // 📌 เพิ่มโค้ดสำหรับเปิดเมนู Dropdown ของแอดมินที่นี่
};

// 3. ฟังก์ชันสำหรับดึงข้อมูลจาก Database / API สำหรับแอดมิน
const fetchAdminNavbarData = async () => {
  try {
    // 📌 จำลองว่ามีออเดอร์ใหม่เข้ามา 3 รายการ รอจัดการ
    // เมื่อเชื่อม API จริง ให้แทนที่ตรงนี้
    newOrderCount.value = 3;
  } catch (error) {
    console.error('ดึงข้อมูล Admin Navbar ล้มเหลว:', error);
  }
};

// 4. สั่งให้ทำงานเมื่อ Navbar โหลดเสร็จ
onMounted(() => {
  fetchAdminNavbarData();
});
</script>

<style scoped>
/* โหลดฟอนต์จาก Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
</style>