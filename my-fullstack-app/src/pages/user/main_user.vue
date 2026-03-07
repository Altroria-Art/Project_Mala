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
        <button class="cook-btn" :class="{ active: cookType === 'boil' }" @click="changeMode('boil')">
          <span class="emoji">🍲</span><span class="font-bold">แบบต้ม</span>
        </button>
        <button class="cook-btn" :class="{ active: cookType === 'grill' }" @click="changeMode('grill')">
          <span class="emoji">🔥</span><span class="font-bold">แบบย่าง</span>
        </button>
        <button class="cook-btn" :class="{ active: cookType === 'ready' }" @click="changeMode('ready')">
          <span class="emoji">🥤</span><span class="font-bold">พร้อมทาน</span>
        </button>
      </div>

      <div class="category-scroll">
        <button class="category-btn" :class="{ active: currentCategory === 'all' }" @click="currentCategory = 'all'">ทั้งหมด</button>
        <button class="category-btn" :class="{ active: currentCategory === 'meat' }" @click="currentCategory = 'meat'">เนื้อ</button>
        <button class="category-btn" :class="{ active: currentCategory === 'veg' }" @click="currentCategory = 'veg'">ผัก</button>
        <button class="category-btn" :class="{ active: currentCategory === 'drink' }" @click="currentCategory = 'drink'">เครื่องดื่ม/ข้าว</button>
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
// เพิ่ม onMounted เข้ามาที่นี่
import { ref, onMounted } from 'vue'; 
import ProductGrid from '../../components/user/ProductGrid.vue';
import CartModal from '../../components/user/CartModal.vue'; 
import Billmodal from '../../components/user/Billmodal.vue'; 
import { useCartStore } from '../../stores/cartStore'; 

const cartStore = useCartStore(); 
const isCartOpen = ref(false);
const isBillOpen = ref(false); 
const cookType = ref('boil'); 
const currentCategory = ref('all'); 

// ดึงข้อมูลบิลเมื่อโหลดหน้าเว็บ
onMounted(() => {
  // ดึงทันทีที่โหลดเสร็จ 1 ครั้ง
  cartStore.syncBills();
  
  // ให้ดึงข้อมูลเช็คบิลใหม่ทุกๆ 10 วินาที
  setInterval(() => {
    cartStore.syncBills();
  }, 10000);
});

const openCart = () => { isCartOpen.value = true; };
const closeCart = () => { isCartOpen.value = false; };

const openBill = () => { isBillOpen.value = true; };
const closeBill = () => { isBillOpen.value = false; };

const changeMode = (mode) => {
  cookType.value = mode;

  if (mode === 'ready') {
    currentCategory.value = 'all';
  } 
  else if (currentCategory.value === 'drink') {
    currentCategory.value = 'all';
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap');
.mobile-app-container { max-width: 480px; margin: 0 auto; min-height: 100vh; background-color: #f0f2f5; position: relative; display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
.app-header { background-color: #fff; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 10; }
.header-top { display: flex; justify-content: space-between; align-items: center; }
.logo-area { display: flex; align-items: center; gap: 12px; }
.logo-wrapper { width: 45px; height: 45px; border-radius: 50%; overflow: hidden; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); flex-shrink: 0; }
.logo-img { width: 100%; height: 100%; object-fit: cover; }
.brand-text { display: flex; flex-direction: column; justify-content: center; }
.brand-title { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 1.35rem; font-weight: 900; color: #1f2937; line-height: 1.1; letter-spacing: 0px; }
.brand-subtitle { margin: 0; margin-top: 2px; font-family: 'Montserrat', sans-serif; font-size: 0.55rem; color: #e53935; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
.header-icons { display: flex; gap: 16px; align-items: center; margin-right: 4px; }
.icon-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0; position: relative; }
.badge { position: absolute; top: -6px; right: -8px; background-color: #e53935; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 50%; font-weight: bold; }
.cook-type-section { display: flex; gap: 8px; margin-bottom: 20px; margin-top: 8px; }
.cook-btn { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; background-color: #fff; border: 2px solid transparent; border-radius: 12px; font-size: 0.9rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: all 0.2s; }
.cook-btn .emoji { font-size: 1.6rem; margin-bottom: 4px; }
.cook-btn.active { background-color: #fce4e4; border-color: #e53935; color: #e53935; }
.category-scroll { display: flex; overflow-x: auto; gap: 12px; margin-bottom: 16px; padding-bottom: 8px; scrollbar-width: none; }
.category-scroll::-webkit-scrollbar { display: none; }
.category-btn { white-space: nowrap; padding: 8px 20px; border-radius: 20px; border: none; background-color: #fff; font-size: 0.95rem; font-weight: 500; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.3s; }
.category-btn.active { background-color: #fce4e4; color: #000; font-weight: bold; }
.app-content { flex: 1; padding: 0 16px 16px 16px; padding-bottom: 100px; overflow-y: auto; }
.bottom-cart-bar { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 448px; background-color: #fff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 6px 20px rgba(0,0,0,0.15); border-radius: 30px; z-index: 20; }
.cart-info { display: flex; align-items: center; }
.total-price { font-size: 1.1rem; font-weight: bold; color: #333; }
.checkout-btn { background-color: #e53935; color: white; border: none; padding: 12px 20px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 1rem; }
.cook-btn, .category-btn, .checkout-btn, .icon-btn {
  transition: transform 0.1s ease, box-shadow 0.2s ease;
}
.cook-btn:active, .category-btn:active, .checkout-btn:active, .icon-btn:active {
  transform: scale(0.92);
}
.cook-btn.active, .category-btn.active {
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.2);
}
.brand-title {
  margin: 0;
  font-family: 'Permanent Marker', cursive; 
  font-size: 1.8rem;
  font-weight: 400;  
  color: #e53935; 
  line-height: 1.1;
  letter-spacing: 1px;
  text-shadow: 2px 2px 0px #000; 
  transform: rotate(-2deg); 
}

.brand-subtitle {
  margin: 0;
  margin-top: 4px;
  font-family: 'Prompt', sans-serif; 
  font-size: 0.6rem;
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}
</style>