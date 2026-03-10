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
            :disabled="product.stock <= 0"
            @click="cartStore.addToCart(product, currentCookType)"
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
.product-card { background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; flex-direction: column; position: relative; }
.image-container { background-color: #e0e0e0; height: 120px; display: flex; justify-content: center; align-items: center; padding: 10px; position: relative; }
.image-container img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }

/* ป้ายสินค้าหมด แปะทับรูปภาพ */
.out-of-stock-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.6); display: flex; justify-content: center; align-items: center; font-size: 1.2rem; font-weight: bold; color: #c62828; z-index: 1; }

.product-info { padding: 12px; display: flex; flex-direction: column; gap: 6px; flex: 1; z-index: 2; }
.title-price { display: flex; justify-content: space-between; align-items: flex-start; gap: 4px; }
.title { font-size: 0.85rem; color: #333; line-height: 1.2; }
.price { font-size: 0.9rem; font-weight: bold; color: #000; white-space: nowrap; }

.stock-status { font-size: 0.75rem; font-weight: 600; margin-top: -2px; }
.text-red { color: #c62828; }

.add-btn { width: 100%; background-color: #fce4e4; color: #333; border: none; padding: 6px; border-radius: 6px; font-size: 0.8rem; font-weight: 500; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 4px; margin-top: auto; transition: background-color 0.2s; }
.plus-icon { font-size: 1rem; font-weight: normal; }

.disabled-btn { background-color: #f5f5f5 !important; color: #9e9e9e !important; cursor: not-allowed !important; box-shadow: none; }
</style>