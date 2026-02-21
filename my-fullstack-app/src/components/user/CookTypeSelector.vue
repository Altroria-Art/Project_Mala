<script setup>
// รับค่า v-model จากหน้าหลัก
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const selectType = (type) => {
  emit('update:modelValue', type);
};
</script>

<template>
  <div class="grid grid-cols-2 gap-4 mb-6">
    <!-- แบบต้ม -->
    <button 
      @click="selectType('boil')"
      :class="['flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all', 
               modelValue === 'boil' ? 'bg-[#FDECEE] border-[#A82D2D] text-[#A82D2D]' : 'bg-white border-transparent shadow-sm text-gray-700']"
    >
      <!-- ไอคอนหรือภาพหม้อต้ม -->
      <span class="text-3xl mb-1">🍲</span>
      <span class="font-semibold text-lg">แบบต้ม</span>
    </button>
    
    <!-- แบบย่าง -->
    <button 
      @click="selectType('grill')"
      :class="['flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all', 
               modelValue === 'grill' ? 'bg-[#FDECEE] border-[#A82D2D] text-[#A82D2D]' : 'bg-white border-transparent shadow-sm text-gray-700']"
    >
      <!-- ไอคอนหรือภาพเตาย่าง -->
      <span class="text-3xl mb-1">🔥</span>
      <span class="font-semibold text-lg">แบบย่าง</span>
    </button>
  </div>
</template>