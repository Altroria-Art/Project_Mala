<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../../stores/cartStore'; 
import Navbar from '../../components/user/navbar.vue';
import CookTypeSelector from '../../components/user/CookTypeSelector.vue';
import ProductGrid from '../../components/user/ProductGrid.vue';
import CartModal from '../../components/user/CartModal.vue'; 
import BillModal from '../../components/user/BillModal.vue';

// เรียกใช้งาน Store สำหรับจัดการตะกร้าและบิล
const cartStore = useCartStore();

// สถานะการเปิด/ปิดหน้าต่าง Modal
const isCartOpen = ref(false); 
const isBillOpen = ref(false);
const cookType = ref('boil'); // ค่าเริ่มต้นหมวดการปรุง

// ข้อมูลรายการอาหารจำลอง
const allProducts = ref([
  { id: 1, name: 'หมูสามชั้นสไลซ์/3 ชิ้น', price: 10, category: 'meat', cookType: 'boil', image: 'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?w=200&h=200&fit=crop' },
  { id: 2, name: 'สันคอหมูสไลซ์/3 ชิ้น', price: 10, category: 'meat', cookType: 'boil', image: 'https://images.unsplash.com/photo-1606489379685-ce1fc80104f6?w=200&h=200&fit=crop' },
  { id: 3, name: 'เส้นมันหนึบ', price: 20, category: 'other', cookType: 'boil', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?w=200&h=200&fit=crop' },
  { id: 4, name: 'เส้นบุก', price: 20, category: 'other', cookType: 'boil', image: 'https://images.unsplash.com/photo-1608500218890-c4f7131b26f1?w=200&h=200&fit=crop' },
  { id: 7, name: 'ผักบุ้ง', price: 10, category: 'veg', cookType: 'boil', image: 'https://images.unsplash.com/photo-1628773822503-72216892ba09?w=200&h=200&fit=crop' },
  { id: 9, name: 'เนื้อสวรรค์เสียบไม้/1 ไม้', price: 10, category: 'meat', cookType: 'grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop' },
  { id: 10, name: 'ฮั่นแน่เนื้อสวรรค์/1 ไม้', price: 10, category: 'meat', cookType: 'grill', image: 'https://images.unsplash.com/photo-1544025162-8356bbbcdd29?w=200&h=200&fit=crop' },
  { id: 11, name: 'กระเจี๊ยบเขียวย่าง', price: 10, category: 'veg', cookType: 'grill', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=200&h=200&fit=crop' },
  { id: 5, name: 'เต้าหู้ปลา/3 ชิ้น', price: 10, category: 'other', cookType: 'both', image: 'https://images.unsplash.com/photo-1596649298818-a6d8011c272a?w=200&h=200&fit=crop' },
  { id: 6, name: 'เต้าหู้ชีส/3 ชิ้น', price: 10, category: 'other', cookType: 'both', image: 'https://images.unsplash.com/photo-1625937759419-4809e2e6c4ea?w=200&h=200&fit=crop' },
]);

// กรองสินค้าที่จะแสดงตามหมวดการปรุง (ต้ม/ย่าง)
const displayedProducts = computed(() => {
  return allProducts.value.filter(
    item => item.cookType === cookType.value || item.cookType === 'both'
  );
});

// ฟังก์ชันจัดการเหตุการณ์ต่างๆ
const handleAddToCart = (product) => cartStore.addToCart(product, cookType.value);
const handleOpenCart = () => isCartOpen.value = true;
const handleCloseCart = () => isCartOpen.value = false;
const handleOpenBill = () => isBillOpen.value = true;
const handleCloseBill = () => isBillOpen.value = false;
</script>

<template>
  <!-- พื้นหลังดำด้านนอกสุดเพื่อให้เห็นขอบเขตหน้าจอมือถือชัดเจน -->
  <div class="min-h-screen bg-zinc-900 flex justify-center overflow-x-hidden">
    
    <!-- Mobile Container: จำกัดความกว้างที่ 480px และจัดให้อยู่ตรงกลาง -->
    <div class="w-full max-w-[480px] bg-[#F4F4F5] min-h-screen relative shadow-2xl flex flex-col overflow-x-hidden border-x border-zinc-800/50">
      
      <!-- Navbar -->
      <Navbar 
        class="shrink-0"
        :cartCount="cartStore.totalItems"
        :orderCount="cartStore.orderCount"
        @open-cart="handleOpenCart"
        @open-bill="handleOpenBill"
      />

      <!-- ส่วนเนื้อหาหลัก: ใส่ overflow-y-auto เพื่อให้เลื่อนได้แค่ในพื้นที่นี้ -->
      <main class="flex-1 px-5 pt-6 pb-28 overflow-y-auto overflow-x-hidden scroll-smooth">
        <CookTypeSelector v-model="cookType" />
        <ProductGrid 
          :products="displayedProducts" 
          @add-to-cart="handleAddToCart" 
        />
      </main>

      <!-- ส่วนจัดการหน้าต่างป๊อปอัพต่างๆ -->
      <CartModal :isOpen="isCartOpen" @close="handleCloseCart" />
      <BillModal :isOpen="isBillOpen" @close="handleCloseBill" />

    </div>
  </div>
</template>

<style>
/* ตั้งค่าฟอนต์และพื้นฐาน CSS */
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Kanit', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #18181b; /* สีดำนอก Container */
}

/* ป้องกันการเลื่อนหน้าจอด้านข้างของมือถือ */
html, body {
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}

/* ซ่อน Scrollbar สำหรับ Browser ส่วนใหญ่ */
::-webkit-scrollbar {
  display: none;
}
</style>