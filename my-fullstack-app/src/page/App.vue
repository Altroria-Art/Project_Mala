<script setup>

</script>

<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    
    <div class="w-full max-w-md bg-white shadow-xl min-h-screen flex flex-col">
      
      <header class="p-4 flex justify-between items-center border-b">
        <h1 class="text-xl font-bold text-orange-600">Mala Verse1</h1>
        <div class="relative">
          <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">0</span>
          🛒
        </div>
      </header>

      <main class="p-4 flex-1 overflow-y-auto">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <button class="bg-red-100 p-4 rounded-xl border-2 border-red-400">แบบต้ม</button>
          <button class="bg-gray-50 p-4 rounded-xl border border-gray-200">แบบย่าง</button>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="bg-gray-50 p-2 rounded-lg text-center shadow-sm">
            <div class="bg-gray-200 h-24 mb-2 rounded"></div>
            <p class="text-sm font-semibold">หมูสามชั้นสไลด์</p>
            <p class="text-xs text-gray-500">20฿</p>
            <button class="mt-2 bg-red-50 text-red-600 text-xs py-1 px-4 rounded-full border border-red-200">
              เพิ่มรายการ +
            </button>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>

</style>
