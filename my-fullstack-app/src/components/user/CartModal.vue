<script setup>
import { ref, computed } from 'vue';

// รับค่า State มาจากหน้าหลัก
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cartItems: {
    type: Array,
    required: true
  }
});

// กำหนด Event ที่จะส่งกลับไปให้หน้าหลัก
const emit = defineEmits(['close', 'increase-qty', 'decrease-qty']);

// --- State ตัวเลือกในตะกร้า (ตามแบบ Figma) ---
const boilSoup = ref('หม่าล่าดั้งเดิม');
const boilSpice = ref('เผ็ดน้อย');
const grillSpice = ref('เผ็ดน้อย');

// ข้อมูลตัวเลือก
const soupOptions = ['หม่าล่าดั้งเดิม', 'หม่าล่านม'];
const spiceOptions = ['เผ็ดน้อย', 'เผ็ดกลาง', 'เผ็ดมาก'];

// --- Computed Properties ---
// แยกรายการในตะกร้าเป็นต้มกับย่าง
const cartBoiledItems = computed(() => props.cartItems.filter(i => i.typeAddedAs === 'boil'));
const cartGrilledItems = computed(() => props.cartItems.filter(i => i.typeAddedAs === 'grill'));

// ราคารวมทั้งหมด
const totalCartPrice = computed(() => {
  return props.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center">
    <!-- ฉากหลังสีดำโปร่งแสง -->
    <div class="absolute inset-0 bg-black/60" @click="emit('close')"></div>
    
    <!-- ตัวกล่อง Modal -->
    <div class="relative w-[92%] max-w-[400px] h-[85vh] bg-[#E8E1DE] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
      
      <!-- Header (สีแดง) -->
      <div class="bg-[#B91C1C] text-white py-3 px-4 flex justify-between items-center shrink-0">
        <h2 class="text-base font-medium mx-auto">รายการอาหารที่เลือก</h2>
        <button @click="emit('close')" class="absolute right-4 text-white text-xl leading-none">&times;</button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto pb-4">
        
        <!-- หมวด: รายการต้ม -->
        <div v-if="cartBoiledItems.length > 0" class="mb-2">
          <!-- หัวข้อรายการต้ม (สีเหลือง/ส้ม) -->
          <div class="bg-[#FFB800] text-[#7A5B00] font-medium px-4 py-2 text-sm shadow-sm">
            รายการต้ม
          </div>
          
          <div class="p-4 bg-[#EFCFCF]/30">
            <!-- เลือกน้ำซุป -->
            <div class="mb-3">
              <p class="text-xs font-medium text-gray-800 mb-2">เลือกน้ำซุปหม่าล่า</p>
              <div class="flex gap-2">
                <button 
                  v-for="soup in soupOptions" :key="soup"
                  @click="boilSoup = soup"
                  :class="['px-4 py-1.5 rounded-full text-xs transition-colors', 
                           boilSoup === soup ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'bg-gray-200/60 text-gray-500']"
                >
                  {{ soup }}
                </button>
              </div>
            </div>

            <!-- เลือกระดับความเผ็ด -->
            <div class="mb-4">
              <p class="text-xs font-medium text-gray-800 mb-2">เลือกระดับความเผ็ด</p>
              <div class="flex gap-2">
                <button 
                  v-for="spice in spiceOptions" :key="spice"
                  @click="boilSpice = spice"
                  :class="['px-4 py-1.5 rounded-full text-xs transition-colors', 
                           boilSpice === spice ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'bg-gray-200/60 text-gray-500']"
                >
                  {{ spice }}
                </button>
              </div>
            </div>

            <!-- รายการอาหารต้ม -->
            <div class="flex flex-col gap-2">
              <div v-for="item in cartBoiledItems" :key="'boil-'+item.id" class="bg-white rounded-lg p-2.5 flex items-center shadow-sm relative">
                <!-- รูป -->
                <div class="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 mr-3">
                  <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <!-- รายละเอียด -->
                <div class="flex-1 min-w-0 pr-16">
                  <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h4>
                  <p class="text-[10px] text-gray-500 mt-0.5 truncate">{{ boilSoup }}: {{ boilSpice }}</p>
                </div>
                <!-- ราคา -->
                <div class="absolute top-2.5 right-3 text-xs font-semibold text-gray-800">{{ item.price }}฿</div>
                <!-- ปุ่มบวกลบ -->
                <div class="absolute bottom-2.5 right-3 flex items-center gap-2 bg-white">
                  <button @click="emit('decrease-qty', item)" class="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-500 text-xs font-bold shrink-0">
                    <span class="-translate-y-[1px]">-</span>
                  </button>
                  <span class="text-sm font-medium w-3 text-center">{{ item.quantity }}</span>
                  <button @click="emit('increase-qty', item)" class="w-5 h-5 flex items-center justify-center rounded-full bg-[#E87A24] text-white text-xs font-bold shrink-0">
                    <span class="-translate-y-[1px]">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- หมวด: รายการย่าง -->
        <div v-if="cartGrilledItems.length > 0">
           <!-- หัวข้อรายการย่าง (สีเทา) -->
           <div class="bg-[#D1D5DB] text-gray-700 font-medium px-4 py-2 text-sm shadow-sm">
            รายการย่าง
          </div>

          <div class="p-4 bg-[#EFCFCF]/30">
            <!-- เลือกระดับความเผ็ด -->
            <div class="mb-4">
              <p class="text-xs font-medium text-gray-800 mb-2">เลือกระดับความเผ็ดของเมนูย่าง</p>
              <div class="flex gap-2">
                <button 
                  v-for="spice in spiceOptions" :key="'grill-'+spice"
                  @click="grillSpice = spice"
                  :class="['px-4 py-1.5 rounded-full text-xs transition-colors', 
                           grillSpice === spice ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'bg-gray-200/60 text-gray-500']"
                >
                  {{ spice }}
                </button>
              </div>
            </div>

            <!-- รายการอาหารย่าง -->
            <div class="flex flex-col gap-2">
              <div v-for="item in cartGrilledItems" :key="'grill-'+item.id" class="bg-white rounded-lg p-2.5 flex items-center shadow-sm relative">
                <!-- รูป -->
                <div class="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 mr-3">
                  <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <!-- รายละเอียด -->
                <div class="flex-1 min-w-0 pr-16">
                  <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h4>
                  <p class="text-[10px] text-gray-500 mt-0.5 truncate">{{ grillSpice }}</p>
                </div>
                <!-- ราคา -->
                <div class="absolute top-2.5 right-3 text-xs font-semibold text-gray-800">{{ item.price }}฿</div>
                <!-- ปุ่มบวกลบ -->
                <div class="absolute bottom-2.5 right-3 flex items-center gap-2 bg-white">
                  <button @click="emit('decrease-qty', item)" class="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-500 text-xs font-bold shrink-0">
                    <span class="-translate-y-[1px]">-</span>
                  </button>
                  <span class="text-sm font-medium w-3 text-center">{{ item.quantity }}</span>
                  <button @click="emit('increase-qty', item)" class="w-5 h-5 flex items-center justify-center rounded-full bg-[#E87A24] text-white text-xs font-bold shrink-0">
                    <span class="-translate-y-[1px]">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- แสดงข้อความถ้าไม่มีของในตะกร้า -->
        <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center h-40 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-2 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <p>ยังไม่มีรายการอาหาร</p>
        </div>

      </div>

      <!-- Footer: ยอดรวมและปุ่มสั่งซื้อ -->
      <div class="bg-[#EEEEEE] p-4 shrink-0 rounded-b-xl relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-medium text-gray-700">ยอดรวมทั้งหมด :</span>
          <span class="text-lg font-medium text-gray-900">{{ totalCartPrice }} บาท</span>
        </div>
        <button 
          :disabled="cartItems.length === 0"
          class="w-full bg-[#FF0000] disabled:bg-red-300 text-white font-bold py-3 rounded-xl shadow-md transition-transform active:scale-95"
        >
          ยืนยันสั่งซื้อ
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* อนิเมชั่นเลื่อนขึ้นเบาๆ สำหรับ Modal โดนย้ายมาไว้ที่นี่แล้ว */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}
</style>