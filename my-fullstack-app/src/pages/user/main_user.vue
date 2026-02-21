<script setup>
// เพิ่ม computed เข้ามาใช้งาน
import { ref, computed } from 'vue';
// เปลี่ยนจากการใช้ @/ เป็น ../../ เพื่อถอยโฟลเดอร์กลับไปที่ src
import Navbar from '../../components/user/navbar.vue';
import CookTypeSelector from '../../components/user/CookTypeSelector.vue';
import ProductGrid from '../../components/user/ProductGrid.vue';

// State พื้นฐาน (อนาคตย้ายไป Pinia Store)
const cartCount = ref(0);
const orderCount = ref(0);
const cookType = ref('boil'); // ค่าเริ่มต้นคือต้ม

// ข้อมูลจำลอง (Mock Data) - เพิ่มฟิลด์ cookType ให้แต่ละเมนู
const allProducts = ref([
  // เมนูแบบต้ม
  { id: 1, name: 'หมูสามชั้นสไลซ์/3 ชิ้น', price: 10, category: 'meat', cookType: 'boil' },
  { id: 2, name: 'สันคอหมูสไลซ์/3 ชิ้น', price: 10, category: 'meat', cookType: 'boil' },
  { id: 3, name: 'เส้นมันหนึบ', price: 20, category: 'other', cookType: 'boil' },
  { id: 4, name: 'เส้นบุก', price: 20, category: 'other', cookType: 'boil' },
  { id: 7, name: 'ผักบุ้ง', price: 10, category: 'veg', cookType: 'boil' },
  // เมนูแบบย่าง
  { id: 9, name: 'หมูสามชั้นพันเข็มทอง', price: 15, category: 'meat', cookType: 'grill' },
  { id: 10, name: 'เนื้อวัวเสียบไม้', price: 20, category: 'meat', cookType: 'grill' },
  { id: 11, name: 'กระเจี๊ยบเขียวย่าง', price: 10, category: 'veg', cookType: 'grill' },
  { id: 12, name: 'เห็ดออรินจิย่าง', price: 15, category: 'veg', cookType: 'grill' },
  // เมนูที่สั่งได้ทั้งต้มและย่าง
  { id: 5, name: 'เต้าหู้ปลา/3 ชิ้น', price: 10, category: 'other', cookType: 'both' },
  { id: 6, name: 'เต้าหู้ชีส/3 ชิ้น', price: 10, category: 'other', cookType: 'both' },
  { id: 8, name: 'เห็ดเข็มทอง', price: 15, category: 'veg', cookType: 'both' },
]);

// กรองรายการอาหารให้แสดงเฉพาะแบบที่เลือก (ต้ม, ย่าง หรือ ทั้งคู่)
const displayedProducts = computed(() => {
  return allProducts.value.filter(
    item => item.cookType === cookType.value || item.cookType === 'both'
  );
});

// ฟังก์ชันจัดการเมื่อกดปุ่ม "เพิ่มรายการ" ในลูก
const handleAddToCart = (product) => {
  cartCount.value++;
  console.log(`เพิ่ม ${product.name} ลงตะกร้า (แบบ${cookType.value === 'boil' ? 'ต้ม' : 'ย่าง'})`);
  // ตรงนี้สามารถเพิ่ม logic แจ้งเตือนเล็กๆ (Toast) ได้
};

// ฟังก์ชันสำหรับรับ Event จาก Navbar
const handleOpenBill = () => {
  console.log('เปิดหน้าบิล/ออเดอร์');
  // ใส่ logic เปลี่ยนหน้า หรือเปิด Modal บิลตรงนี้
};

const handleOpenCart = () => {
  console.log('เปิดหน้าตะกร้าสินค้า');
  // ใส่ logic เปลี่ยนหน้า หรือเปิด Modal ตะกร้าตรงนี้
};
</script>

<template>
  <!-- 
    เพิ่ม w-full: ให้เต็มจอมือถือ
    เปลี่ยนเป็น min-h-[100dvh]: รองรับแถบ Address bar บนมือถือที่ซ่อน/โชว์ได้
    เพิ่ม overflow-x-hidden: ป้องกันหน้าจอเลื่อนแนวนอน
  -->
  <div class="w-full max-w-md mx-auto bg-[#F4F4F5] min-h-[100dvh] relative shadow-2xl font-sans overflow-x-hidden">
    
    <!-- 1. ส่วน Header (ใช้ Navbar ที่คุณเขียนเอง) -->
    <Navbar 
      @open-bill="handleOpenBill"
      @open-cart="handleOpenCart"
    />

    <!-- 
      ปรับ Padding ตรงนี้: 
      px-5 (ซ้ายขวา 20px) ให้ตรงกับขอบ Navbar
      pt-6 (บน 24px) ให้มีระยะห่างจาก Navbar
      pb-24 (ล่าง 96px) เผื่อพื้นที่ให้เลื่อนแล้วไม่ติดขอบจอด้านล่าง
    -->
    <main class="px-5 pt-6 pb-24 w-full">
      <!-- 2. ส่วนเลือกประเภทการปรุง (v-model เพื่อเชื่อม state) -->
      <CookTypeSelector v-model="cookType" />

      <!-- 3. ส่วนรายการสินค้า (เปลี่ยนจาก allProducts เป็น displayedProducts) -->
      <ProductGrid 
        :products="displayedProducts" 
        @add-to-cart="handleAddToCart" 
      />
    </main>

  </div>
</template>

<style>
/* ตั้งค่า Font รวมของหน้าแอป (ถ้าคุณตั้งค่าใน tailwind.config.js แล้ว ลบส่วนนี้ได้) */
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap');

body {
  font-family: 'Kanit', sans-serif;
  background-color: #333; /* พื้นหลังจอคอมสีเทาเข้ม */
  margin: 0;
  padding: 0;
  /* ป้องกันการ Scroll แนวนอนในระดับ Body บนมือถือ */
  overflow-x: hidden;
  /* ทำให้ scroll นุ่มนวลขึ้นบนมือถือ */
  -webkit-overflow-scrolling: touch; 
}
</style>