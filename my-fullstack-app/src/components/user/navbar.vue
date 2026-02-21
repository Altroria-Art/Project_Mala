<template>
  <!-- ใช้ px-5 เพื่อให้มีระยะขอบซ้าย-ขวาที่พอดีกับหน้าจอมือถือ -->
  <nav class="w-full h-[65px] bg-white px-5 flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.05)] sticky top-0 z-50">
    
    <!-- ฝั่งซ้าย: โลโก้ และ ชื่อร้าน -->
    <router-link to="/" class="flex items-center gap-3">
      <div class="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-white shadow-sm overflow-hidden border border-gray-100 shrink-0">
        <img src="../../assets/logo.png" alt="Mala Verse Logo" class="w-full h-full object-contain scale-110" />
      </div>
      
      <div class="flex flex-col justify-center">
        <span class="text-[17px] font-bold text-[#0f172a] leading-none mb-1">Mala Verse</span>
        <span class="text-[9px] text-[#94a3b8] font-bold tracking-wider leading-none uppercase">Premium Hotpot</span>
      </div>
    </router-link>

    <!-- ฝั่งขวา: กลุ่มไอคอน -->
    <!-- ปรับระยะห่างระหว่างปุ่มให้กว้างขึ้นด้วย gap-5 เพื่อให้ใช้นิ้วกดบนมือถือได้ง่าย ไม่พลาดไปโดนอีกปุ่ม -->
    <div class="flex items-center gap-5 mt-1">
      
      <!-- ปุ่มไอคอนบิล: เพิ่ม p-1.5 เพื่อให้ปุ่มมีพื้นที่กว้างขึ้น ตัวเลขจะได้ไม่ล้นขอบ -->
      <button @click="clickBill" class="relative p-1.5 cursor-pointer bg-transparent border-none transition-transform active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-7 h-7 text-[#334155]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
        <!-- ย้ายตำแหน่งตัวเลขมาเป็น top-0 right-0 และจัดให้อยู่ในขอบเขตปุ่ม -->
        <span class="absolute top-0 right-0 bg-[#e11d48] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none border-2 border-white shadow-sm translate-x-0.5 -translate-y-0.5">
          {{ orderCount }}
        </span>
      </button>

      <!-- ปุ่มตะกร้า: เพิ่ม p-1.5 เช่นเดียวกัน -->
      <button @click="$emit('open-cart')" class="relative p-1.5 cursor-pointer bg-transparent border-none transition-transform active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-7 h-7 text-[#334155]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span class="absolute top-0 right-0 bg-[#e11d48] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none border-2 border-white shadow-sm translate-x-0.5 -translate-y-0.5">
          {{ cartCount }}
        </span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['open-bill', 'open-cart']);
const orderCount = ref(0);
const cartCount = ref(0);

const clickBill = () => {
  emit('open-bill');
};

const fetchNavbarData = async () => {
  try {
    orderCount.value = 0;
    cartCount.value = 0;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => fetchNavbarData());
</script>