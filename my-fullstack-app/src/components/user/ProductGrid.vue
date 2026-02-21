<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add-to-cart']);

// จัดการ State ของหมวดหมู่
const categories = [
  { id: 'meat', name: 'เนื้อ' },
  { id: 'veg', name: 'ผัก' },
  { id: 'other', name: 'อื่นๆ' }
];
const selectedCategory = ref('meat');

// กรองสินค้าตามหมวดหมู่
const filteredProducts = computed(() => {
  return props.products.filter(item => item.category === selectedCategory.value);
});

const handleAddToCart = (product) => {
  emit('add-to-cart', product);
};
</script>

<template>
  <div>
    <!-- แถบเลือกหมวดหมู่ -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-3">หมวดหมู่</h2>
      <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        <button 
          v-for="cat in categories" :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="['px-6 py-1.5 rounded-full font-medium whitespace-nowrap transition-all',
                   selectedCategory === cat.id ? 'bg-[#FDECEE] text-gray-800 shadow-sm' : 'bg-white text-gray-600 shadow-sm']"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- รายการอาหาร Grid -->
    <div class="grid grid-cols-2 gap-3">
      <div v-for="item in filteredProducts" :key="item.id" class="bg-[#EAEAEA] rounded-xl p-2 flex flex-col justify-between">
        <div>
          <!-- พื้นที่ใส่รูปภาพ -->
          <div class="bg-white rounded-lg h-28 w-full mb-2 flex items-center justify-center overflow-hidden">
            <!-- ปิดรูปตัวอย่างไป ใส่ class พื้นหลังเทาแทน -->
             <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                 รูปภาพ: {{ item.name }}
             </div>
          </div>
          
          <!-- ชื่อและราคา -->
          <div class="flex justify-between items-start mb-2 px-1">
            <h3 class="text-[13px] font-medium leading-tight text-gray-800 flex-1 pr-1">{{ item.name }}</h3>
            <span class="text-[13px] font-semibold text-gray-900">{{ item.price }}฿</span>
          </div>
        </div>
        
        <!-- ปุ่มเพิ่มรายการ -->
        <button 
          @click="handleAddToCart(item)"
          class="w-full bg-[#FCE4E4] hover:bg-[#F8D0D0] text-gray-800 text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 transition-colors"
        >
          เพิ่มรายการ +
        </button>
      </div>
    </div>
    
    <!-- แจ้งเตือนเมื่อไม่มีสินค้า -->
    <div v-if="filteredProducts.length === 0" class="text-center py-10 text-gray-500">
      ไม่มีรายการอาหารในหมวดหมู่นี้
    </div>
  </div>
</template>

<style scoped>
/* ซ่อน Scrollbar สำหรับแถบหมวดหมู่ (เฉพาะ Component นี้) */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>