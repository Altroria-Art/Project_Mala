<template>
  <!-- กรอบ Navbar หลัก -->
  <nav class="w-full h-[65px] bg-white px-4 flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.05)] sticky top-0 z-50">
    
    <!-- ฝั่งซ้าย: โลโก้ และ ชื่อร้าน -->
    <router-link to="/" class="flex items-center gap-[10px]">
      <!-- โลโก้ -->
      <div class="w-[50px] h-[50px] flex items-center justify-center">
        <img src="../../assets/logo.png" alt="Mala Verse Logo" class="w-full h-full object-contain" />
      </div>

      <!-- ชื่อร้าน -->
      <span class="font-['Permanent_Marker',_cursive] text-[24px] font-bold text-black tracking-[0.03em] mt-[2px]">
        Mala Verse
      </span>
    </router-link>

    <!-- ฝั่งขวา: กลุ่มไอคอน (บิล และ ตะกร้า) -->
    <div class="flex items-center gap-5 mr-1 mt-1">
      
      <!-- 1. ไอคอนบิล/รายการสั่งซื้อ (เปลี่ยนเป็นปุ่มสำหรับเปิด Pop-up) -->
      <button @click="openOrderPopup" class="relative flex items-center justify-center cursor-pointer bg-transparent border-none p-0">
        <!-- ไอคอนใบเสร็จ (Receipt) สีดำ -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-[28px] h-[28px] fill-black">
          <path fill-rule="evenodd" d="M7 2a2 2 0 0 0-2 2v17a1 1 0 0 0 1.555.832L8 20.877l1.445.955a1 1 0 0 0 1.11 0L12 20.877l1.445.955a1 1 0 0 0 1.11 0L16 20.877l1.445.955A1 1 0 0 0 19 21V4a2 2 0 0 0-2-2H7zm2 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-1a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3zm-3 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-1a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3zm-3 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-1a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3z" clip-rule="evenodd"/>
        </svg>
        
        <!-- ตัวเลขแจ้งเตือนบิล -->
        <span class="absolute -top-[6px] -right-[8px] bg-[#b00000] text-white text-[10px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none">
          {{ orderCount }}
        </span>
      </button>

      <!-- 2. ไอคอนตะกร้าสินค้า (เปลี่ยนเป็นปุ่มสำหรับเปิด Pop-up) -->
      <button @click="openCartPopup" class="relative flex items-center justify-center cursor-pointer bg-transparent border-none p-0">
        <!-- ไอคอนตะกร้าสินค้าแบบทึบ -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-[28px] h-[28px] fill-black">
          <path fill-rule="evenodd" d="M8 8V6a4 4 0 1 1 8 0v2h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1h4zm2-2v2h4V6a2 2 0 1 0-4 0z" clip-rule="evenodd" />
        </svg>
        
        <!-- ตัวเลขแจ้งเตือนตะกร้า -->
        <span class="absolute -top-[6px] -right-[8px] bg-[#b00000] text-white text-[10px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none">
          {{ cartCount }}
        </span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. สร้างตัวแปรแบบ Reactive เพื่อเก็บตัวเลขแจ้งเตือน
const orderCount = ref(0);
const cartCount = ref(0);

// 2. ฟังก์ชันสำหรับเปิด Pop-up (เตรียมไว้สำหรับเชื่อมต่อในอนาคต)
const openOrderPopup = () => {
  console.log('คลิกเปิด Pop-up บิล/รายการสั่งซื้อ');
  // 📌 เพิ่มโค้ดสำหรับเปิด Pop-up บิลของคุณที่นี่
};

const openCartPopup = () => {
  console.log('คลิกเปิด Pop-up ตะกร้าสินค้า');
  // 📌 เพิ่มโค้ดสำหรับเปิด Pop-up ตะกร้าของคุณที่นี่
};

// 3. ฟังก์ชันสำหรับดึงข้อมูลจาก Database / API
const fetchNavbarData = async () => {
  try {
    // 📌 เมื่อคุณมี Backend/Database แล้ว สามารถเอาโค้ดดึงข้อมูลมาใส่ตรงนี้ได้เลย
    orderCount.value = 0;
    cartCount.value = 0;
  } catch (error) {
    console.error('ดึงข้อมูล Navbar ล้มเหลว:', error);
  }
};

// 4. สั่งให้ทำงานเมื่อ Navbar โหลดเสร็จ
onMounted(() => {
  fetchNavbarData();
});
</script>

<style scoped>
/* โหลดฟอนต์จาก Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
</style>