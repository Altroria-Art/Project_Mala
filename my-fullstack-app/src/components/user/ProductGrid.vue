<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  products: { type: Array, required: true }
});

const emit = defineEmits(['add-to-cart']);

// ข้อมูลหมวดหมู่
const categories = [
  { id: 'meat', name: 'เนื้อสัตว์' },
  { id: 'veg', name: 'ผักสด' },
  { id: 'other', name: 'ของทานเล่น' }
];
const selectedCategory = ref('meat');

const filteredProducts = computed(() => {
  return props.products.filter(item => item.category === selectedCategory.value);
});
</script>

<template>
  <div class="flex flex-col">
    <!-- แถบเลือกหมวดหมู่: ปรับให้ Sticky ทำงานร่วมกับ Navbar ได้ดีขึ้น -->
    <div class="sticky top-[65px] z-30 bg-[#F4F4F5]/90 backdrop-blur-md -mx-5 px-5 py-3 border-b border-zinc-200/50">
      <div class="flex gap-2 overflow-x-auto hide-scrollbar">
        <button 
          v-for="cat in categories" :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="[
            'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border uppercase tracking-wide',
            selectedCategory === cat.id 
              ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-md shadow-red-200' 
              : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- รายการอาหาร Grid -->
    <div class="grid grid-cols-2 gap-3 py-5">
      <div 
        v-for="item in filteredProducts" :key="item.id" 
        class="bg-white rounded-2xl p-2.5 flex flex-col border border-zinc-100 shadow-sm active:scale-[0.97] transition-transform overflow-hidden"
      >
        <!-- รูปภาพสินค้า -->
        <div class="aspect-square bg-zinc-100 rounded-xl mb-3 overflow-hidden relative border border-zinc-50/50">
          <div class="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] text-center p-3 font-medium">
            [รูปภาพ: {{ item.name }}]
          </div>
        </div>
        
        <!-- ข้อมูลสินค้า -->
        <div class="flex-1 px-1 flex flex-col justify-between">
          <h3 class="text-[13px] font-bold text-zinc-800 leading-tight mb-2 line-clamp-2 min-h-[2.6em]">
            {{ item.name }}
          </h3>
          <div class="flex justify-between items-center mt-auto pb-3">
            <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">ราคา</span>
            <span class="text-sm font-black text-[#B91C1C]">{{ item.price }}฿</span>
          </div>
        </div>
        
        <!-- ปุ่มเพิ่มรายการ -->
        <button 
          @click="emit('add-to-cart', item)"
          class="w-full bg-zinc-900 text-white text-[11px] font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:bg-black transition-colors uppercase tracking-widest shadow-sm"
        >
          <span>เพิ่ม</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- หน้าจอว่างเปล่า -->
    <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-zinc-300">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
        </svg>
      </div>
      <p class="text-zinc-400 text-sm font-medium">ยังไม่มีรายการในหมวดนี้</p>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>