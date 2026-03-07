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
import { menuService } from '../../services/menuService';

// 1. รับค่าโหมดและหมวดหมู่ที่ส่งมาจากหน้า main_user.vue
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

// 2. ประกาศตัวแปรเก็บสินค้า
const products = ref([]);
const isLoading = ref(true);

// 3. ฟังก์ชันกรองสินค้าที่เปลี่ยนมาใช้ allowedCookTypes (รองรับ Backend จริง)
const filteredProducts = computed(() => {
  let result = products.value;

  // 1. กรองตามโหมดหลัก (ต้ม / ย่าง / พร้อมทาน)
  result = result.filter(product => {
    // ป้องกัน Error กรณีลืมใส่ allowedCookTypes ใน menuService
    if (!product.allowedCookTypes) return false; 
    
    // เช็คว่าโหมดที่กดอยู่ มีอยู่ในรายการที่สินค้านั้นทำได้หรือไม่
    return product.allowedCookTypes.includes(props.currentCookType);
  });

  // 2. กรองตามปุ่มหมวดหมู่ (เนื้อ, ผัก, เครื่องดื่ม/ข้าว)
  if (props.currentCategory !== 'all') {
    result = result.filter(product => product.category === props.currentCategory);
  }

  return result;
});

// 4. ดึงข้อมูลตอนเปิดหน้าเว็บ
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