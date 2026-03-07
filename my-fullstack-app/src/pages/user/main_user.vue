<template>
  <div class="mobile-app-container">
    
    <header class="app-header">
      <div class="header-top">
        <div class="logo-area">
          <div class="logo-wrapper">
            <img src="../../assets/logo.png" alt="Mala Verse Logo" class="logo-img" />
          </div>
          <div class="brand-text">
            <h1 class="brand-title">Mala Verse</h1>
            <p class="brand-subtitle">MALAVERSE HOT POT & GRILL</p>
          </div>
        </div>
        
        <div class="header-icons">
          <button class="icon-btn" @click="openBill">
            📋 <span class="badge" v-if="cartStore.orderCount > 0">{{ cartStore.orderCount }}</span>
          </button>
          <button class="icon-btn cart-icon-top" @click="openCart">
            🛒 <span class="badge" v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="app-content">
      <div class="cook-type-section">
        <button class="cook-btn" :class="{ active: cookType === 'boil' }" @click="cookType = 'boil'">
          <span class="emoji">🍲</span><span class="font-bold">แบบต้ม</span>
        </button>
        <button class="cook-btn" :class="{ active: cookType === 'grill' }" @click="cookType = 'grill'">
          <span class="emoji">🔥</span><span class="font-bold">แบบย่าง</span>
        </button>
      </div>

      <div class="category-scroll">
        <button class="category-btn" :class="{ active: currentCategory === 'all' }" @click="currentCategory = 'all'">ทั้งหมด</button>
        <button class="category-btn" :class="{ active: currentCategory === 'meat' }" @click="currentCategory = 'meat'">เนื้อ</button>
        <button class="category-btn" :class="{ active: currentCategory === 'veg' }" @click="currentCategory = 'veg'">ผัก</button>
        <button class="category-btn" :class="{ active: currentCategory === 'other' }" @click="currentCategory = 'other'">อื่นๆ</button>
      </div>

      <ProductGrid :current-cook-type="cookType" :current-category="currentCategory" />
    </main>

    <div class="bottom-cart-bar">
      <div class="cart-info">
        <span class="total-price">ยอดรวม: ฿ {{ cartStore.totalPrice }}</span>
      </div>
      <button class="checkout-btn" @click="openCart">ดูตะกร้า / สั่งอาหาร</button>
    </div>

    <CartModal v-if="isCartOpen" @close="closeCart" />
    <Billmodal v-if="isBillOpen" @close="closeBill" />

  </div>
</template>

<script setup>
import { ref } from 'vue'; 
import ProductGrid from '../../components/user/ProductGrid.vue';
import CartModal from '../../components/user/CartModal.vue'; 
import Billmodal from '../../components/user/Billmodal.vue'; 
import { useCartStore } from '../../stores/cartStore'; 

const cartStore = useCartStore(); 
const isCartOpen = ref(false);
const isBillOpen = ref(false); 
const cookType = ref('boil'); 
const currentCategory = ref('all'); 

const openCart = () => { isCartOpen.value = true; };
const closeCart = () => { isCartOpen.value = false; };

const openBill = () => { isBillOpen.value = true; };
const closeBill = () => { isBillOpen.value = false; };
</script>

<style scoped>
/* ดึงฟอนต์ Montserrat มาใช้เฉพาะกับโลโก้ให้ดูพรีเมียม */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap');

/* กำหนดกรอบให้เป็นมือถือ */
.mobile-app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f0f2f5;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0,0,0,0.1); 
}

/* Header */
.app-header {
  background-color: #fff;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* --- CSS สำหรับโลโก้และชื่อร้าน (สไตล์เดียวกับ Admin) --- */
.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-wrapper {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-title {
  margin: 0;
  /* บังคับใช้ฟอนต์ Montserrat เฉพาะจุดนี้ ให้ดูหนาและแพง */
  font-family: 'Montserrat', sans-serif; 
  font-size: 1.35rem; 
  font-weight: 900; /* หนาพิเศษ */
  color: #1f2937;
  line-height: 1.1;
  letter-spacing: 0px;
}

.brand-subtitle {
  margin: 0;
  margin-top: 2px;
  /* บังคับใช้ฟอนต์ Montserrat ให้เข้าชุดกัน */
  font-family: 'Montserrat', sans-serif; 
  font-size: 0.55rem;
  color: #e53935;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px; /* ถ่างตัวหนังสือออกนิดนึงให้ดูพรีเมียม */
}
/* ----------------------------------------------- */

/* จัดกลุ่มไอคอนมุมขวาบน */
.header-icons {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-right: 4px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  position: relative;
}

.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: #e53935;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
}

/* ปุ่มแบบต้ม / แบบย่าง */
.cook-type-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  margin-top: 8px;
}

.cook-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #fff;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.cook-btn .emoji {
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.cook-btn.active {
  background-color: #fce4e4; 
  border-color: #e53935; 
  color: #e53935;
}

/* หมวดหมู่แนวนอน */
.category-scroll {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  scrollbar-width: none; 
}
.category-scroll::-webkit-scrollbar {
  display: none; 
}

.category-btn {
  white-space: nowrap;
  padding: 8px 24px;
  border-radius: 20px;
  border: none;
  background-color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.category-btn.active {
  background-color: #fce4e4;
  color: #000;
  font-weight: bold;
}

/* เนื้อหาหลัก */
.app-content {
  flex: 1;
  padding: 0 16px 16px 16px;
  padding-bottom: 100px; 
  overflow-y: auto;
}

/* แถบด้านล่างปรับเป็นแบบลอย (Floating Bar) */
.bottom-cart-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 448px;
  background-color: #fff;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  border-radius: 30px;
  z-index: 20;
}

.cart-info {
  display: flex;
  align-items: center;
}

.total-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.checkout-btn {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
</style>