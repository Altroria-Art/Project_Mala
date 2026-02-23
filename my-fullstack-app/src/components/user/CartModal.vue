<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../../stores/cartStore'; 

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);
const cartStore = useCartStore();

// สถานะขั้นตอน: 'cart' | 'confirm' | 'success'
const step = ref('cart'); 

const boilSoup = ref('หม่าล่าดั้งเดิม');
const boilSpice = ref('เผ็ดน้อย');
const grillSpice = ref('เผ็ดน้อย');

const soupOptions = ['หม่าล่าดั้งเดิม', 'หม่าล่านม'];
const spiceOptions = ['เผ็ดน้อย', 'เผ็ดกลาง', 'เผ็ดมาก'];

const cartBoiledItems = computed(() => cartStore.items.filter(i => i.typeAddedAs === 'boil'));
const cartGrilledItems = computed(() => cartStore.items.filter(i => i.typeAddedAs === 'grill'));

const handleFinalOrder = async () => {
  await cartStore.checkout(1, boilSoup.value, boilSpice.value, grillSpice.value);
  step.value = 'success';
};

const handleClose = () => {
  step.value = 'cart';
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleClose"></div>
    
    <!-- [STEP 1] รายการอาหาร (สีเหลือง/เทา ตาม Figma) -->
    <div v-if="step === 'cart'" class="relative w-full max-w-[380px] h-[85vh] bg-[#E8E1DE] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in">
      <div class="bg-[#B91C1C] text-white py-3.5 px-4 flex justify-between items-center shrink-0">
        <h2 class="text-sm font-bold mx-auto">รายการอาหารที่เลือก</h2>
        <button @click="handleClose" class="absolute right-4 text-white text-xl leading-none">&times;</button>
      </div>

      <div class="flex-1 overflow-y-auto pb-4">
        <!-- รายการต้ม -->
        <div v-if="cartBoiledItems.length > 0">
          <div class="bg-[#FFB800] text-[#7A5B00] font-black px-4 py-2 text-[11px] uppercase tracking-wider">รายการต้ม</div>
          <div class="p-4 bg-[#EFCFCF]/30 space-y-4">
            <div class="space-y-2">
              <p class="text-[10px] font-bold text-gray-600 uppercase">เลือกน้ำซุปหม่าล่า</p>
              <div class="flex gap-2">
                <button v-for="s in soupOptions" :key="s" @click="boilSoup = s"
                  :class="['px-3 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm', 
                  boilSoup === s ? 'bg-white text-gray-800 border border-gray-200' : 'bg-gray-300/40 text-gray-400']">{{ s }}</button>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-[10px] font-bold text-gray-600 uppercase">เลือกระดับความเผ็ด</p>
              <div class="flex gap-2">
                <button v-for="sp in spiceOptions" :key="sp" @click="boilSpice = sp"
                  :class="['px-3 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm', 
                  boilSpice === sp ? 'bg-white text-gray-800 border border-gray-200' : 'bg-gray-300/40 text-gray-400']">{{ sp }}</button>
              </div>
            </div>
            <div class="space-y-2 pt-2">
              <div v-for="item in cartBoiledItems" :key="item.id" class="bg-white rounded-xl p-2.5 flex items-center shadow-sm relative border border-white">
                <div class="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 mr-3">
                   <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 pr-16">
                  <p class="text-[12px] font-bold text-gray-800 truncate">{{ item.name }}</p>
                  <p class="text-[9px] text-gray-400 font-medium">{{ boilSoup }} | {{ boilSpice }}</p>
                </div>
                <div class="absolute top-2.5 right-3 text-[11px] font-black text-gray-800">{{ item.price }}฿</div>
                <div class="absolute bottom-2.5 right-2.5 flex items-center gap-2.5">
                  <button @click="cartStore.decreaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 text-xs font-bold">-</button>
                  <span class="text-xs font-black w-3 text-center text-gray-700">{{ item.quantity }}</span>
                  <button @click="cartStore.increaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full bg-[#E87A24] text-white text-xs font-bold">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- รายการย่าง -->
        <div v-if="cartGrilledItems.length > 0">
          <div class="bg-[#D1D5DB] text-gray-600 font-black px-4 py-2 text-[11px] uppercase tracking-wider">รายการย่าง</div>
          <div class="p-4 bg-[#EFCFCF]/30 space-y-4">
             <div class="space-y-2">
              <p class="text-[10px] font-bold text-gray-600 uppercase">เลือกระดับความเผ็ดเมนูย่าง</p>
              <div class="flex gap-2">
                <button v-for="sp in spiceOptions" :key="sp" @click="grillSpice = sp"
                  :class="['px-3 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm', 
                  grillSpice === sp ? 'bg-white text-gray-800 border border-gray-200' : 'bg-gray-300/40 text-gray-400']">{{ sp }}</button>
              </div>
            </div>
            <div class="space-y-2 pt-2">
              <div v-for="item in cartGrilledItems" :key="item.id" class="bg-white rounded-xl p-2.5 flex items-center shadow-sm relative border border-white">
                <div class="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 mr-3">
                   <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 pr-16">
                  <p class="text-[12px] font-bold text-gray-800 truncate">{{ item.name }}</p>
                  <p class="text-[9px] text-gray-400 font-medium">{{ grillSpice }}</p>
                </div>
                <div class="absolute top-2.5 right-3 text-[11px] font-black text-gray-800">{{ item.price }}฿</div>
                <div class="absolute bottom-2.5 right-2.5 flex items-center gap-2.5">
                  <button @click="cartStore.decreaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 text-xs font-bold">-</button>
                  <span class="text-xs font-black w-3 text-center text-gray-700">{{ item.quantity }}</span>
                  <button @click="cartStore.increaseQty(item)" class="w-5 h-5 flex items-center justify-center rounded-full bg-[#E87A24] text-white text-xs font-bold">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-5 bg-white border-t border-gray-100 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold text-gray-400">ยอดรวมทั้งหมด :</span>
          <span class="text-lg font-black text-gray-900">{{ cartStore.totalPrice }} บาท</span>
        </div>
        <button @click="step = 'confirm'" :disabled="cartStore.items.length === 0"
          class="w-full bg-[#FF0000] text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-red-200 active:scale-[0.98] transition-all disabled:opacity-30">
          ยืนยันสั่งซื้อ
        </button>
      </div>
    </div>

    <!-- [STEP 2] ยืนยันการสั่งซื้อ? (Pop-up กลางจอ) -->
    <div v-if="step === 'confirm'" class="relative w-[320px] bg-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl animate-pop">
      <div class="w-20 h-20 bg-[#FDE6D2] rounded-full flex items-center justify-center mb-6">
        <span class="text-4xl">🤔</span>
      </div>
      <h3 class="text-xl font-black text-gray-800 mb-2">ยืนยันการสั่งซื้อ?</h3>
      <p class="text-[11px] text-gray-400 mb-8 leading-relaxed px-4">กรุณาตรวจสอบรายการของท่านก่อนกดยืนยัน เมื่อทำการยืนยันแล้วไม่สามารถยกเลิกได้</p>
      <div class="w-full space-y-3">
        <button @click="handleFinalOrder" class="w-full bg-[#F27F21] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-100 active:scale-95 transition-all">ยืนยันการสั่ง</button>
        <button @click="step = 'cart'" class="w-full bg-gray-50 text-gray-400 py-3.5 rounded-2xl font-bold active:scale-95 transition-all">ยกเลิก</button>
      </div>
    </div>

    <!-- [STEP 3] สั่งอาหารเรียบร้อยแล้ว (Success Checkmark) -->
    <div v-if="step === 'success'" class="relative w-[320px] bg-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl animate-pop">
      <div class="w-20 h-20 bg-[#E1F7E8] rounded-full flex items-center justify-center mb-6">
        <span class="text-4xl text-[#22C55E]">✅</span>
      </div>
      <h3 class="text-xl font-black text-gray-800 mb-2">สั่งอาหารเรียบร้อยแล้ว</h3>
      <p class="text-[11px] text-gray-400 mb-8 leading-relaxed">กำลังเตรียมเมนูของท่าน เตรียมรับความแซ่บได้เลย</p>
      <button @click="handleClose" class="w-full bg-[#2B2D42] text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-all">ปิด</button>
    </div>
  </div>
</template>

<style scoped>
.animate-in { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-pop { animation: pop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.4); }
@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
::-webkit-scrollbar { display: none; }
</style>