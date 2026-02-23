<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../../stores/cartStore'; 
import Navbar from '../../components/user/navbar.vue';
import CookTypeSelector from '../../components/user/CookTypeSelector.vue';
import ProductGrid from '../../components/user/ProductGrid.vue';
import CartModal from '../../components/user/CartModal.vue'; 
import BillModal from '../../components/user/BillModal.vue'; // <-- 1. Import BillModal เข้ามาที่นี่

const cartStore = useCartStore();

const isCartOpen = ref(false); 
const isBillOpen = ref(false); // <-- 2. สร้าง State ควบคุมการเปิด/ปิดหน้าบิล
const cookType = ref('boil'); 

// ข้อมูลจำลอง (Mock Data)
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

const displayedProducts = computed(() => {
  return allProducts.value.filter(
    item => item.cookType === cookType.value || item.cookType === 'both'
  );
});

const handleAddToCart = (product) => {
  cartStore.addToCart(product, cookType.value);
};

// ฟังก์ชันเปิด/ปิด Modal ตะกร้า
const handleOpenCart = () => isCartOpen.value = true;
const handleCloseCart = () => isCartOpen.value = false;

// ฟังก์ชันเปิด/ปิด Modal บิล (ไอคอนซ้าย)
const handleOpenBill = () => isBillOpen.value = true;
const handleCloseBill = () => isBillOpen.value = false;
</script>

<template>
  <div class="w-full max-w-md mx-auto bg-[#F4F4F5] min-h-[100dvh] relative shadow-2xl font-sans overflow-x-hidden flex flex-col">
    
    <!-- Navbar เชื่อม props ทั้งตัวเลขตะกร้าและตัวเลขบิล -->
    <!-- ดักจับ Event @open-bill ให้เรียกฟังก์ชันเปิดหน้าบิล -->
    <Navbar 
      :cartCount="cartStore.totalItems"
      :orderCount="cartStore.orderCount"
      @open-cart="handleOpenCart"
      @open-bill="handleOpenBill"
    />

    <main class="px-5 pt-6 pb-24 w-full flex-1">
      <CookTypeSelector v-model="cookType" />
      <ProductGrid 
        :products="displayedProducts" 
        @add-to-cart="handleAddToCart" 
      />
    </main>

    <!-- Modal ตะกร้า -->
    <CartModal :isOpen="isCartOpen" @close="handleCloseCart" />

    <!-- 3. วาง Component บิลที่เพิ่มเข้ามาใหม่ -->
    <BillModal :isOpen="isBillOpen" @close="handleCloseBill" />

  </div>
</template>

<style>
/* ตั้งค่า Font รวมของหน้าแอป */
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Kanit', sans-serif;
  background-color: #333; 
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch; 
}
</style>