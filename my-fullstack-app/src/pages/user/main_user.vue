<script setup>
import { ref, computed } from 'vue';
import Navbar from '../../components/user/navbar.vue';
import CookTypeSelector from '../../components/user/CookTypeSelector.vue';
import ProductGrid from '../../components/user/ProductGrid.vue';
// Import Component ตะกร้า
import CartModal from '../../components/user/CartModal.vue'; 

// --- State การจัดการตะกร้าและ UI ---
const isCartOpen = ref(false); // สถานะเปิด-ปิด Modal ตะกร้า
const cookType = ref('boil'); // ค่าเริ่มต้นหน้าหลักคือหมวด 'ต้ม'

// รายการอาหารในตะกร้า { id, name, price, quantity, typeAddedAs (boil/grill), image }
const cartItems = ref([]);

// --- ข้อมูลจำลอง (Mock Data) อัปเดตเพิ่มรูปภาพให้เหมือนจริงขึ้น ---
const allProducts = ref([
  // เมนูแบบต้ม
  { id: 1, name: 'หมูสามชั้นสไลซ์/3 ชิ้น', price: 10, category: 'meat', cookType: 'boil', image: 'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?w=200&h=200&fit=crop' },
  { id: 2, name: 'สันคอหมูสไลซ์/3 ชิ้น', price: 10, category: 'meat', cookType: 'boil', image: 'https://images.unsplash.com/photo-1606489379685-ce1fc80104f6?w=200&h=200&fit=crop' },
  { id: 3, name: 'เส้นมันหนึบ', price: 20, category: 'other', cookType: 'boil', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?w=200&h=200&fit=crop' },
  { id: 4, name: 'เส้นบุก', price: 20, category: 'other', cookType: 'boil', image: 'https://images.unsplash.com/photo-1608500218890-c4f7131b26f1?w=200&h=200&fit=crop' },
  { id: 7, name: 'ผักบุ้ง', price: 10, category: 'veg', cookType: 'boil', image: 'https://images.unsplash.com/photo-1628773822503-72216892ba09?w=200&h=200&fit=crop' },
  
  // เมนูแบบย่าง
  { id: 9, name: 'เนื้อสวรรค์เสียบไม้/1 ไม้', price: 10, category: 'meat', cookType: 'grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop' },
  { id: 10, name: 'ฮั่นแน่เนื้อสวรรค์/1 ไม้', price: 10, category: 'meat', cookType: 'grill', image: 'https://images.unsplash.com/photo-1544025162-8356bbbcdd29?w=200&h=200&fit=crop' },
  { id: 11, name: 'กระเจี๊ยบเขียวย่าง', price: 10, category: 'veg', cookType: 'grill', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=200&h=200&fit=crop' },
  
  // เมนูที่สั่งได้ทั้งต้มและย่าง
  { id: 5, name: 'เต้าหู้ปลา/3 ชิ้น', price: 10, category: 'other', cookType: 'both', image: 'https://images.unsplash.com/photo-1596649298818-a6d8011c272a?w=200&h=200&fit=crop' },
  { id: 6, name: 'เต้าหู้ชีส/3 ชิ้น', price: 10, category: 'other', cookType: 'both', image: 'https://images.unsplash.com/photo-1625937759419-4809e2e6c4ea?w=200&h=200&fit=crop' },
]);

// --- Computed Properties ---
// กรองสินค้าที่แสดงหน้าหลักตามปุ่ม ต้ม/ย่าง
const displayedProducts = computed(() => {
  return allProducts.value.filter(
    item => item.cookType === cookType.value || item.cookType === 'both'
  );
});

// จำนวนชิ้นทั้งหมดในตะกร้า (ส่งไปให้ Navbar)
const totalCartItemsCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

// --- Functions จัดการตะกร้า ---
const handleAddToCart = (product) => {
  // บันทึกว่าเพิ่มเข้ามาจากหมวดไหน (ต้ม หรือ ย่าง)
  const addedAs = cookType.value; 
  
  // หาว่ามีสินค้านี้ (ในหมวดปรุงนี้) อยู่ในตะกร้าหรือยัง
  const existingItem = cartItems.value.find(item => item.id === product.id && item.typeAddedAs === addedAs);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
    cartItems.value.push({ 
      ...product, 
      quantity: 1, 
      typeAddedAs: addedAs 
    });
  }
};

const increaseQty = (item) => {
  item.quantity++;
};

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    // ถ้าเหลือ 1 แล้วกดลบ ให้ลบออกจากตะกร้า
    const index = cartItems.value.indexOf(item);
    if (index > -1) cartItems.value.splice(index, 1);
  }
};

const handleOpenCart = () => {
  isCartOpen.value = true;
};

const handleCloseCart = () => {
  isCartOpen.value = false;
};
</script>

<template>
  <div class="w-full max-w-md mx-auto bg-[#F4F4F5] min-h-[100dvh] relative shadow-2xl font-sans overflow-x-hidden flex flex-col">
    
    <!-- Navbar -->
    <Navbar 
      :cartCount="totalCartItemsCount"
      :orderCount="0"
      @open-cart="handleOpenCart"
    />

    <!-- เนื้อหาหลัก -->
    <main class="px-5 pt-6 pb-24 w-full flex-1">
      <CookTypeSelector v-model="cookType" />
      <ProductGrid 
        :products="displayedProducts" 
        @add-to-cart="handleAddToCart" 
      />
    </main>

    <!-- ========================================== -->
    <!-- Modal ตะกร้าสินค้า (Popup) ที่ดึงมาจาก Component -->
    <!-- ========================================== -->
    <CartModal 
      :isOpen="isCartOpen" 
      :cartItems="cartItems" 
      @close="handleCloseCart"
      @increase-qty="increaseQty"
      @decrease-qty="decreaseQty"
    />

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