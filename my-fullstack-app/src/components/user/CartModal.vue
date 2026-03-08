<template>
  <Teleport to="body">
    <div class="cart-modal-overlay">
      <div class="cart-modal-container">
        
        <header class="cart-header">
          <button class="icon-btn back-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="header-title">รายการอาหารที่เลือก</h2>
          
          <button class="icon-btn delete-btn" @click="confirmClearCart" v-if="cartStore.items.length > 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
          <div v-else style="width: 36px;"></div> 
        </header>

        <main class="cart-body">
          
          <div v-if="cartStore.items.length === 0" class="empty-cart">
            ยังไม่มีสินค้าในตะกร้า
          </div>

          <div v-else class="cart-items-section">
            
            <div v-if="boiledItems.length > 0" class="menu-group">
              <h4 class="group-title">🍲 เมนูแบบต้ม</h4>
              <div v-for="item in boiledItems" :key="item.id + 'boil'" class="cart-item">
                <div class="item-info">
                  <p class="item-name">{{ item.name }}</p>
                  <p class="item-price">{{ item.price * item.quantity }}฿</p>
                </div>
                <div class="qty-control">
                  <button class="qty-btn" @click="cartStore.decreaseQty(item)">-</button>
                  <span class="qty-number">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="cartStore.increaseQty(item)">+</button>
                </div>
              </div>
            </div>

            <div v-if="grilledItems.length > 0" class="menu-group">
              <h4 class="group-title">🔥 เมนูแบบย่าง</h4>
              <div v-for="item in grilledItems" :key="item.id + 'grill'" class="cart-item">
                <div class="item-info">
                  <p class="item-name">{{ item.name }}</p>
                  <p class="item-price">{{ item.price * item.quantity }}฿</p>
                </div>
                <div class="qty-control">
                  <button class="qty-btn" @click="cartStore.decreaseQty(item)">-</button>
                  <span class="qty-number">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="cartStore.increaseQty(item)">+</button>
                </div>
              </div>
            </div>

            <div v-if="readyItems.length > 0" class="menu-group">
              <h4 class="group-title">🥤 เครื่องดื่ม & พร้อมทาน</h4>
              <div v-for="item in readyItems" :key="item.id + 'ready'" class="cart-item">
                <div class="item-info">
                  <p class="item-name">{{ item.name }}</p>
                  <p class="item-price">{{ item.price * item.quantity }}฿</p>
                </div>
                <div class="qty-control">
                  <button class="qty-btn" @click="cartStore.decreaseQty(item)">-</button>
                  <span class="qty-number">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="cartStore.increaseQty(item)">+</button>
                </div>
              </div>
            </div>

          </div>

          <hr class="divider" v-if="cartStore.items.length > 0" />

          <div v-if="boiledItems.length > 0">
            <div class="options-section">
              <h3 class="option-title">น้ำซุป (สำหรับแบบต้ม)</h3>
              <div class="option-grid">
                <button class="option-chip" :class="{ active: soupType === 'original' }" @click="soupType = 'original'">ซุปหม่าล่าดั้งเดิม</button>
                <button class="option-chip" :class="{ active: soupType === 'milk' }" @click="soupType = 'milk'">ซุปหม่าล่านม</button>
              </div>
            </div>
            
            <div class="options-section">
              <h3 class="option-title">ความเผ็ดซุป</h3>
              <div class="option-grid">
                <button class="option-chip" :class="{ active: boilSpiceLevel === 1 }" @click="boilSpiceLevel = 1">ระดับ 1</button>
                <button class="option-chip" :class="{ active: boilSpiceLevel === 2 }" @click="boilSpiceLevel = 2">ระดับ 2</button>
                <button class="option-chip" :class="{ active: boilSpiceLevel === 3 }" @click="boilSpiceLevel = 3">ระดับ 3</button>
              </div>
            </div>
          </div>

          <div v-if="grilledItems.length > 0">
            <div class="options-section">
              <h3 class="option-title">ความเผ็ดย่าง</h3>
              <div class="option-grid">
                <button class="option-chip" :class="{ active: grillSpiceLevel === 1 }" @click="grillSpiceLevel = 1">ระดับ 1</button>
                <button class="option-chip" :class="{ active: grillSpiceLevel === 2 }" @click="grillSpiceLevel = 2">ระดับ 2</button>
                <button class="option-chip" :class="{ active: grillSpiceLevel === 3 }" @click="grillSpiceLevel = 3">ระดับ 3</button>
              </div>
            </div>
          </div>

        </main>

        <footer class="cart-footer">
          <div class="summary-text">
            <span>{{ cartStore.totalItems }} รายการ</span>
            <span class="total-price">รวม {{ cartStore.totalPrice }}฿</span>
          </div>
          <button 
            class="checkout-btn" 
            :disabled="cartStore.items.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': cartStore.items.length === 0 }"
            @click="showConfirm = true"
          >
            สั่งอาหาร
          </button>
        </footer>

        <div v-if="showConfirm" class="confirm-overlay">
          <div class="confirm-box">
            <div class="icon-warning">🔔</div>
            <h3>ยืนยันการสั่งอาหาร?</h3>
            <p>เมื่อกดสั่งอาหารแล้ว ทางร้านจะเริ่มทำอาหารทันที <br/><span class="text-red">"ไม่สามารถยกเลิกออเดอร์ได้"</span></p>
            <div class="confirm-actions">
              <button class="cancel-btn" @click="showConfirm = false">ยกเลิก</button>
              <button class="confirm-btn" @click="confirmOrder">ยืนยันสั่งอาหาร</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../../stores/cartStore';

const cartStore = useCartStore();

const boiledItems = computed(() => cartStore.items.filter(item => item.typeAddedAs === 'boil'));
const grilledItems = computed(() => cartStore.items.filter(item => item.typeAddedAs === 'grill'));
const readyItems = computed(() => cartStore.items.filter(item => item.typeAddedAs === 'ready'));

const soupType = ref('original'); 
const boilSpiceLevel = ref(1); 
const grillSpiceLevel = ref(1); 

const showConfirm = ref(false); 

const emit = defineEmits(['close']);
const closeModal = () => emit('close');

// เพิ่มฟังก์ชันสำหรับกดยืนยันก่อนลบตะกร้า
const confirmClearCart = () => {
  const isConfirmed = window.confirm("คุณต้องการลบรายการอาหารทั้งหมดในตะกร้าใช่หรือไม่?");
  if (isConfirmed) {
    if (cartStore.clearCart) {
      cartStore.clearCart();
    } else {
      // เผื่อว่าใน Store ยังไม่ได้ใส่ฟังก์ชัน clearCart สามารถลบตรงๆ แบบนี้ได้เลย
      cartStore.items = [];
      localStorage.setItem('cart_items', JSON.stringify([]));
    }
  }
};

const confirmOrder = async () => {
  await cartStore.checkout('1', soupType.value, boilSpiceLevel.value, grillSpiceLevel.value);
  showConfirm.value = false; 
  emit('close'); 
};
</script>

<style scoped>
/* แก้ไขหน่วยความสูงตรงนี้เพื่อแก้บัคมือถือ */
.cart-modal-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100vh; /* เผื่อเบราว์เซอร์เก่า */
  height: 100dvh; /* แก้บัคยืดในมือถือใหม่ */
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex; 
  justify-content: center; 
  align-items: flex-end; 
  z-index: 9999; 
}

.cart-modal-container { 
  position: relative; 
  width: 100%; 
  max-width: 480px; 
  height: 100%; /* ให้ยืดตาม max-height */
  max-height: 85vh; /* เผื่อเบราว์เซอร์เก่า */
  max-height: 85dvh; /* บังคับความสูงไม่ให้ทะลุจอ */
  background-color: #fff; 
  border-radius: 20px 20px 0 0; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
  animation: slideUp 0.3s ease-out; 
}

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.cart-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f0f0f0; }
.header-title { margin: 0; font-size: 1.1rem; font-weight: bold; color: #333; }
.icon-btn { background: none; border: none; cursor: pointer; color: #333; display: flex; align-items: center; justify-content: center; padding: 8px; }
.delete-btn { color: #ff4d4f; }

.cart-body { flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 24px; }

.menu-group { margin-bottom: 20px; }
.group-title { font-size: 1rem; font-weight: bold; color: #c62828; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #eee; }

.cart-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.item-info { display: flex; flex-direction: column; gap: 4px; }
.item-name { margin: 0; font-size: 1rem; color: #333; }
.item-price { margin: 0; font-weight: bold; color: #000; }

.qty-control { display: flex; align-items: center; background-color: #f5f5f5; border-radius: 8px; padding: 4px; }
.qty-btn { background-color: white; border: none; width: 28px; height: 28px; border-radius: 6px; font-weight: bold; font-size: 1.1rem; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.qty-number { margin: 0 12px; font-weight: bold; }

.divider { border: none; border-top: 6px solid #f0f2f5; margin: 16px -16px; }

.options-section { margin-bottom: 24px; }
.option-title { font-size: 0.95rem; font-weight: bold; margin-bottom: 12px; color: #555; }
.option-grid { display: flex; flex-wrap: wrap; gap: 12px; }
.option-chip { padding: 8px 16px; border: 1px solid #ddd; background-color: #fff; border-radius: 8px; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
.option-chip.active { background-color: #c62828; color: #fff; border-color: #c62828; font-weight: bold; }

.cart-footer { padding: 16px; background-color: #fff; border-top: 1px solid #eee; box-shadow: 0 -4px 12px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 12px; z-index: 10; }
.summary-text { display: flex; justify-content: space-between; font-size: 1rem; color: #555; }
.total-price { font-weight: bold; color: #000; font-size: 1.1rem; }

.checkout-btn { width: 100%; background-color: #c62828; color: #fff; border: none; padding: 14px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
.checkout-btn:disabled { background-color: #ccc; cursor: not-allowed; }

.empty-cart { text-align: center; padding: 40px 20px; color: #999; font-size: 1rem; }

/* --- CSS สำหรับป๊อปอัปยืนยันการสั่งอาหาร --- */
.confirm-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 50; border-radius: 20px 20px 0 0; }
.confirm-box { background-color: #fff; width: 85%; max-width: 320px; border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.icon-warning { font-size: 3rem; margin-bottom: 12px; }
.confirm-box h3 { margin: 0 0 10px 0; font-size: 1.2rem; color: #333; }
.confirm-box p { margin: 0 0 20px 0; font-size: 0.9rem; color: #666; line-height: 1.5; }
.text-red { color: #e53935; font-weight: bold; }
.confirm-actions { display: flex; gap: 12px; }
.cancel-btn { flex: 1; padding: 12px; background-color: #f3f4f6; color: #4b5563; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
.confirm-btn { flex: 1; padding: 12px; background-color: #e53935; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
</style>