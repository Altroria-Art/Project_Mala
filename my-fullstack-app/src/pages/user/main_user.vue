<template>
  <!-- ปรับให้กว้างเต็มจอ 100% (w-full) และยืดหยุ่นตามขนาดมือถือทุกรุ่น -->
  <div class="min-h-screen bg-gray-50 w-full flex flex-col overflow-x-hidden relative">
    
    <!-- 1. เรียกใช้ Navbar (จะขยายเต็มความกว้างจออัตโนมัติ) -->
    <Navbar @open-bill="isBillOpen = true" />
    
    <!-- 2. เนื้อหาของหน้าย่อยต่างๆ จะมาแสดงตรงนี้ -->
    <main class="w-full flex-1 pb-20">
      <router-view />
    </main>

    <!-- 3. เรียกใช้ Pop-up บิล -->
    <BillModal :is-open="isBillOpen" @close="isBillOpen = false" />
    
  </div>
</template>

<script setup>
import { ref } from 'vue';

// นำเข้า Component ต่างๆ
import Navbar from '../../components/user/navbar.vue';
import BillModal from '../../components/user/Billmodal.vue'; 

// ตัวแปรสำหรับเปิด/ปิดบิล
const isBillOpen = ref(false);
</script>