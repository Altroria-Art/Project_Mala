<template>
  <div class="product-grid">
    
    <div v-if="isLoading" class="col-span-2 text-center text-gray-400 py-8">
      กำลังโหลดเมนูอาหาร... 🍲
    </div>

    <template v-else>
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="image-container">
          <img :src="product.image || 'https://via.placeholder.com/100'" :alt="product.name" />
        </div>
        
        <div class="product-info">
          <div class="title-price">
            <span class="title">{{ product.name }}</span>
            <span class="price">{{ product.price }}฿</span>
          </div>
          
          <button class="add-btn" @click="cartStore.addToCart(product, currentCookType)">
            เพิ่มรายการ <span class="plus-icon">+</span>
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
import { menuService } from '../../services/menuService'; // <--- เรียกใช้ menuService ที่คุณสร้างไว้

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

// ตัวแปรเก็บข้อมูลสินค้า และสถานะการโหลด
const products = ref([]);
const isLoading = ref(true);

// ดึงข้อมูลจาก menuService ตอนที่หน้าเว็บโหลดขึ้นมา
onMounted(async () => {
  try {
    isLoading.value = true;
    // ดึงข้อมูลเมนูทั้งหมดมาเก็บไว้ (รอ 0.5 วินาทีตามที่คุณเขียนไว้)
    products.value = await menuService.getMenus(); 
  } catch (error) {
    console.error("ดึงข้อมูลเมนูไม่สำเร็จ:", error);
  } finally {
    isLoading.value = false;
  }
});

// ฟังก์ชันกรองสินค้าตามหมวดหมู่
const filteredProducts = computed(() => {
  if (props.currentCategory === 'all') {
    return products.value;
  }
  return products.value.filter(product => product.category === props.currentCategory);
});
</script>

<style scoped>
/* --- CSS โครงสร้างเดิม --- */
.product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.product-card { background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
.image-container { background-color: #e0e0e0; height: 120px; display: flex; justify-content: center; align-items: center; padding: 10px; }
.image-container img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
.product-info { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.title-price { display: flex; justify-content: space-between; align-items: flex-start; gap: 4px; }
.title { font-size: 0.85rem; color: #333; line-height: 1.2; }
.price { font-size: 0.9rem; font-weight: bold; color: #000; white-space: nowrap; }
.add-btn { width: 100%; background-color: #fce4e4; color: #333; border: none; padding: 6px; border-radius: 6px; font-size: 0.8rem; font-weight: 500; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 4px; margin-top: auto; }
.plus-icon { font-size: 1rem; font-weight: normal; }
</style>