<template>
  <div class="product-grid">
    
    <div v-if="isLoading" class="col-span-2 text-center text-gray-400 py-8">
      กำลังโหลดเมนูอาหาร... 🍲
    </div>

    <template v-else>
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="image-container">
          <img :src="product.image || 'https://via.placeholder.com/100'" :alt="product.name" />
          
          <div v-if="product.stock <= 0" class="out-of-stock-overlay">
            หมด
          </div>
        </div>
        
        <div class="product-info">
          <div class="title-price">
            <span class="title">{{ product.name }}</span>
            <span class="price">{{ product.price }}฿</span>
          </div>
          
          <div v-if="product.stock <= 0" class="stock-status text-red">
            <span>สินค้าหมด</span>
          </div>
          
          <button 
            class="add-btn" 
            :class="{ 'disabled-btn': product.stock <= 0 }"
            @click="handleAddToCart(product, currentCookType)"
          >
            <span v-if="product.stock > 0">เพิ่มรายการ <span class="plus-icon">+</span></span>
            <span v-else>สินค้าหมด ❌</span>
          </button>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="col-span-2 text-center text-gray-400 py-8">
        ยังไม่มีสินค้าในหมวดหมู่นี้
      </div>
    </template>

    <Teleport to="body">
      <div v-if="showStockAlert" class="stock-alert-overlay" @click="showStockAlert = false">
        <div class="stock-alert-box" @click.stop>
          <div class="alert-icon">⚠️</div>
          <h3 class="alert-title">ขออภัยครับ</h3>
          <p class="alert-desc">{{ alertMessage }}</p>
          <button class="alert-ok-btn" @click="showStockAlert = false">ตกลง</button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; 
import { useCartStore } from '../../stores/cartStore'; 
import { menuService } from '../../services/menuService';

const props = defineProps({
  currentCookType: {
    type: String,
    required: true
  },
  currentCategory: {
    type: String,
    required: true
  }
});

const cartStore = useCartStore();

const products = ref([]);
const isLoading = ref(true);

const showStockAlert = ref(false);
const alertMessage = ref('');

const handleAddToCart = (product, cookType) => {
  if (product.stock <= 0) {
    alertMessage.value = `เมนู "${product.name}" หมดชั่วคราวครับ`;
    showStockAlert.value = true;
    return;
  }

  const existingItem = cartStore.items.find(item => item.id === product.id && item.typeAddedAs === cookType);
  
  if (existingItem && existingItem.quantity >= product.stock) {
    alertMessage.value = `คุณเลือก "${product.name}" ครบจำนวนสต๊อกที่มี (${product.stock} ชิ้น) แล้วครับ`;
    showStockAlert.value = true;
    return;
  }

  cartStore.addToCart(product, cookType);
};

const filteredProducts = computed(() => {
  let result = products.value;

  result = result.filter(product => {
    if (!product.allowedCookTypes) return false; 
    return product.allowedCookTypes.includes(props.currentCookType);
  });

  if (props.currentCategory !== 'all') {
    result = result.filter(product => product.category === props.currentCategory);
  }

  return result;
});

onMounted(async () => {
  try {
    isLoading.value = true;
    products.value = await menuService.getMenus(); 
  } catch (error) {
    console.error("ดึงข้อมูลเมนูไม่สำเร็จ:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.product-card { background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; flex-direction: column; position: relative; border: 1px solid #f0f0f0; }

.image-container { background-color: #f5f5f5; height: 120px; display: flex; justify-content: center; align-items: center; position: relative; }
.image-container img { width: 100%; height: 100%; object-fit: cover; }

.out-of-stock-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.6); display: flex; justify-content: center; align-items: center; font-size: 1.1rem; font-weight: bold; color: #c62828; z-index: 1; backdrop-filter: blur(1px); }

.product-info { padding: 10px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.title-price { display: flex; justify-content: space-between; align-items: flex-start; gap: 4px; }
.title { font-size: 0.85rem; color: #333; line-height: 1.2; font-weight: 500; }
.price { font-size: 0.9rem; font-weight: bold; color: #c62828; white-space: nowrap; }

.stock-status { font-size: 0.75rem; font-weight: 600; margin-top: -2px; }
.text-red { color: #c62828; }

.add-btn { width: 100%; background-color: #fff1f1; color: #c62828; border: 1px solid #ffcccc; padding: 8px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 4px; margin-top: auto; transition: all 0.2s; }
.add-btn:active { transform: scale(0.95); background-color: #ffcccc; }
.plus-icon { font-size: 1rem; }

.disabled-btn { background-color: #f5f5f5 !important; color: #9e9e9e !important; border: 1px solid #e0e0e0 !important; cursor: not-allowed; }

.stock-alert-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(2px); }
.stock-alert-box { background-color: #fff; width: 85%; max-width: 300px; border-radius: 20px; padding: 30px 20px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.2); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

@keyframes popIn { 
  0% { transform: scale(0.8); opacity: 0; } 
  100% { transform: scale(1); opacity: 1; } 
}

.alert-icon { font-size: 3.5rem; margin-bottom: 15px; }
.alert-title { margin: 0 0 10px 0; font-size: 1.3rem; color: #333; font-weight: 800; }
.alert-desc { margin: 0 0 25px 0; font-size: 0.95rem; color: #666; line-height: 1.6; }
.alert-ok-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #ff6b6b, #e53935); color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 1.1rem; box-shadow: 0 5px 15px rgba(229, 57, 53, 0.3); }
.alert-ok-btn:active { transform: scale(0.97); }
</style>