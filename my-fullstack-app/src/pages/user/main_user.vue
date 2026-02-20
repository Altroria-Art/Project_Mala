<template>
  <div class="min-h-screen bg-gray-50">
    <!-- เรียกใช้ Navbar ของ User ที่นี่ -->
    <Navbar />
    
    <!-- ส่วนนี้จะใช้แสดงผลหน้าย่อยของ User (เช่น หน้าแรก, หน้าสินค้า, หน้าตะกร้า) -->
    <main class="w-full h-full">
      <!-- ถ้าคุณใช้ Nested Route ให้ใส่ router-view ตรงนี้ -->
      <!-- แต่ถ้าหน้า main_user เป็นแค่หน้าแรกเฉยๆ ก็ใส่เนื้อหาตรงนี้ได้เลยครับ -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
// ทำการ Import Navbar เข้ามาที่หน้านี้แทน
// (ตรวจสอบ Path ให้ตรงกับโครงสร้างจริงของคุณนะครับ)
import Navbar from '../../components/user/navbar.vue'
</script>