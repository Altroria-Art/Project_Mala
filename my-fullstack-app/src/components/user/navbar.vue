<script setup>
defineProps({ cartCount: Number, orderCount: Number });
defineEmits(['open-bill', 'open-cart']);
</script>

<template>
  <nav class="w-full h-[70px] bg-white px-5 flex items-center justify-between shadow-sm sticky top-0 z-50">
    <div class="flex items-center gap-2">
      <div class="w-10 h-10 rounded-full border border-gray-100 overflow-hidden shadow-sm">
        <img src="../../assets/logo.png" class="w-full h-full object-contain" alt="Logo" />
      </div>
      <div class="flex flex-col">
        <span class="text-base font-bold text-gray-800 leading-none">Mala Verse</span>
        <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Premium Hotpot</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <!-- ไอคอนบิล (ซ้าย) -->
      <button @click="$emit('open-bill')" class="relative p-2 active:scale-90 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-7 h-7 text-gray-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25" />
        </svg>
        <span v-if="orderCount > 0" class="absolute -top-1 -right-1 bg-[#E11D48] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-[2.5px] border-white shadow-md">
          {{ orderCount }}
        </span>
      </button>

      <!-- ไอคอนตะกร้า (ขวา) -->
      <button @click="$emit('open-cart')" class="relative p-2 active:scale-90 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-7 h-7 text-gray-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-[#E11D48] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-[2.5px] border-white shadow-md">
          {{ cartCount }}
        </span>
      </button>
    </div>
  </nav>
</template>