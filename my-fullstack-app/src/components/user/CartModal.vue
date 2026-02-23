<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../../stores/cartStore'; 

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);
const cartStore = useCartStore();

const boilSoup = ref('หม่าล่าดั้งเดิม');
const boilSpice = ref('เผ็ดน้อย');
const grillSpice = ref('เผ็ดน้อย');

const soupOptions = ['หม่าล่าดั้งเดิม', 'หม่าล่านม'];
const spiceOptions = ['เผ็ดน้อย', 'เผ็ดกลาง', 'เผ็ดมาก'];

const cartBoiledItems = computed(() => cartStore.items.filter(i => i.typeAddedAs === 'boil'));
const cartGrilledItems = computed(() => cartStore.items.filter(i => i.typeAddedAs === 'grill'));

// ฟังก์ชันนี้จะถูกเรียกตอนกดปุ่ม
const processCheckout = async () => {
  await cartStore.checkout(1, boilSoup.value, boilSpice.value, grillSpice.value);
  emit('close'); // สั่งเสร็จให้ปิดหน้าต่างตะกร้า
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/60" @click="emit('close')"></div>
    
    <div class="relative w-[92%] max-w-[400px] h-[85vh] bg-[#E8E1DE] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
      
      <div class="bg-[#B91C1C] text-white py-3 px-4 flex justify-between items-center shrink-0">
        <h2 class="text-base font-medium mx-auto">รายการอาหารที่เลือก</h2>
        <button @click="emit('close')" class="absolute right-4 text-white text-xl leading-none">&times;</button>
      </div>

      <div class="flex-1 overflow-y-auto pb-4">
        
        <!-- หมวด: รายการต้ม -->
        <div v-if="cartBoiledItems.length > 0" class="mb-2">
          <div class="bg-[#FFB800] text-[#7A5B00] font-medium px-4 py-2 text-sm shadow-sm">รายการต้ม</div>
          <div class="p-4 bg-[#EFCFCF]/30">
            <div class="mb-3">
              <p class="text-xs font-medium text-gray-800 mb-2">เลือกน้ำซุปหม่าล่า</p>
              <div class="flex gap-2">
                <button 
                  v-for="soup in soupOptions" :key="soup" @click="boilSoup = soup"
                  :class="['px-4 py-1.5 rounded-full text-xs transition-colors', boilSoup === soup ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'bg-gray-200/60 text-gray-500']"
                >{{ soup }}</button>
              </div>
            </div>

            <div class="mb-4">
              <p class="text-xs font-medium text-gray-800 mb-2">เลือกระดับความเผ็ด</p>
              <div class="flex gap-2">
                <button 
                  v-for="spice in spiceOptions" :key="spice" @click="boilSpice = spice"
                  :class="['px-4 py-1.5 rounded-full text-xs transition-colors', boilSpice === spice ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'bg-gray-200/60 text-gray-500']"
                >{{ spice }}</button>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div v-for="item in cartBoiledItems" :key="'boil-'+item.id" class="bg-white rounded-lg p-2.5 flex items-center shadow-sm relative">
                <div class="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 mr-3">
                  <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0 pr-16">
                  <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h4>
                  <p class="text-[10px] text-gray-500 mt-0.5 truncate">{{ boilSoup }}: {{ boilSpice }}</p>
                </div>
                <div class="absolute top-2.5 right-3 text-xs font-semibold text-gray-800">{{ item.price }}฿</div>
                
                <div class="absolute bottom-2.5 right-3 flex items-center gap-2 bg-white">
                  <button @click="cartStore.decreaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-500 text-xs font-bold shrink-0"><span class="-translate-y-[1px]">-</span></button>
                  <span class="text-sm font-medium w-3 text-center">{{ item.quantity }}</span>
                  <button @click="cartStore.increaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full bg-[#E87A24] text-white text-xs font-bold shrink-0"><span class="-translate-y-[1px]">+</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- หมวด: รายการย่าง -->
        <div v-if="cartGrilledItems.length > 0">
           <div class="bg-[#D1D5DB] text-gray-700 font-medium px-4 py-2 text-sm shadow-sm">รายการย่าง</div>
          <div class="p-4 bg-[#EFCFCF]/30">
            <div class="mb-4">
              <p class="text-xs font-medium text-gray-800 mb-2">เลือกระดับความเผ็ดของเมนูย่าง</p>
              <div class="flex gap-2">
                <button 
                  v-for="spice in spiceOptions" :key="'grill-'+spice" @click="grillSpice = spice"
                  :class="['px-4 py-1.5 rounded-full text-xs transition-colors', grillSpice === spice ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'bg-gray-200/60 text-gray-500']"
                >{{ spice }}</button>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div v-for="item in cartGrilledItems" :key="'grill-'+item.id" class="bg-white rounded-lg p-2.5 flex items-center shadow-sm relative">
                <div class="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 mr-3">
                  <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0 pr-16">
                  <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h4>
                  <p class="text-[10px] text-gray-500 mt-0.5 truncate">{{ grillSpice }}</p>
                </div>
                <div class="absolute top-2.5 right-3 text-xs font-semibold text-gray-800">{{ item.price }}฿</div>
                
                <div class="absolute bottom-2.5 right-3 flex items-center gap-2 bg-white">
                  <button @click="cartStore.decreaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-500 text-xs font-bold shrink-0"><span class="-translate-y-[1px]">-</span></button>
                  <span class="text-sm font-medium w-3 text-center">{{ item.quantity }}</span>
                  <button @click="cartStore.increaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full bg-[#E87A24] text-white text-xs font-bold shrink-0"><span class="-translate-y-[1px]">+</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-40 text-gray-400">
          <p>ยังไม่มีรายการอาหาร</p>
        </div>

      </div>

      <div class="bg-[#EEEEEE] p-4 shrink-0 rounded-b-xl relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-medium text-gray-700">ยอดรวมทั้งหมด :</span>
          <span class="text-lg font-medium text-gray-900">{{ cartStore.totalPrice }} บาท</span>
        </div>
        <!-- ใส่ @click="processCheckout" ตรงนี้ครับ -->
        <button 
          :disabled="cartStore.items.length === 0"
          @click="processCheckout"
          class="w-full bg-[#FF0000] disabled:bg-red-300 text-white font-bold py-3 rounded-xl shadow-md transition-transform active:scale-95"
        >
          ยืนยันสั่งซื้อ
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
</style>