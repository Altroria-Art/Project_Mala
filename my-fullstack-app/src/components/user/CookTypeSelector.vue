<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const selectType = (type) => {
  emit('update:modelValue', type);
};
</script>

<template>
  <div class="bg-zinc-200/50 p-1.5 rounded-2xl flex gap-1 mb-8">
    <!-- แบบต้ม -->
    <button 
      @click="selectType('boil')"
      :class="[
        'flex-1 flex items-center justify-center py-3 rounded-xl transition-all duration-300 font-medium',
        modelValue === 'boil' 
          ? 'bg-white text-[#B91C1C] shadow-md scale-[1.02]' 
          : 'text-zinc-500 hover:text-zinc-700'
      ]"
    >
      <span class="mr-2 text-xl">🍲</span>
      <span>แบบต้ม</span>
    </button>
    
    <!-- แบบย่าง -->
    <button 
      @click="selectType('grill')"
      :class="[
        'flex-1 flex items-center justify-center py-3 rounded-xl transition-all duration-300 font-medium',
        modelValue === 'grill' 
          ? 'bg-white text-[#B91C1C] shadow-md scale-[1.02]' 
          : 'text-zinc-500 hover:text-zinc-700'
      ]"
    >
      <span class="mr-2 text-xl">🔥</span>
      <span>แบบย่าง</span>
    </button>
  </div>
</template>