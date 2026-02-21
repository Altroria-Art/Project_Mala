<template>
  <Teleport to="body">
    <transition name="fade">
      <!-- พื้นหลังสีดำโปร่งใส -->
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
        @click.self="closeModal"
      >
        <!-- ตัวกล่อง Popup หลัก -->
        <div class="bg-white w-full max-w-[360px] max-h-[85vh] rounded-[32px] flex flex-col shadow-2xl relative">
          
          <!-- ส่วนหัว (Header) -->
          <div class="px-6 py-6 flex justify-between items-center z-10 shrink-0">
            <!-- ป้ายบอกเบอร์โต๊ะ -->
            <div class="bg-[#2D1B54] text-white px-5 py-2 rounded-xl text-sm font-medium tracking-wider shadow-sm">
              โต๊ะ {{ tableNumber }}
            </div>
            
            <!-- ราคาทั้งหมด -->
            <div class="text-sm font-medium text-gray-800 flex items-center gap-2">
              ราคาทั้งหมด <span class="font-bold text-[18px]">{{ grandTotal }}฿</span>
            </div>
          </div>

          <!-- ส่วนรายการอาหาร (Body - Scroll ได้) -->
          <div class="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
            
            <!-- กรณีไม่มีข้อมูล -->
            <div v-if="bills.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-400">
              <p>ยังไม่มีรายการสั่งอาหาร</p>
            </div>

            <!-- วนลูปแสดงการ์ดบิลแต่ละรอบ -->
            <div 
              v-for="bill in bills" 
              :key="bill.id" 
              class="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
            >
              <!-- Card Header -->
              <div class="flex justify-between items-center mb-5">
                <span class="bg-[#f87171] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold shadow-sm leading-none">
                  บิลที่ {{ bill.billNumber }}
                </span>
                <span class="text-sm font-medium text-gray-800">
                  ราคา <span class="font-bold text-base ml-1">{{ bill.totalPrice }}฿</span>
                </span>
              </div>

              <!-- รายการอาหารในบิลนั้นๆ -->
              <div class="space-y-3 mb-4">
                <div v-for="item in bill.items" :key="item.id" class="flex justify-between text-[13px] font-medium text-gray-800">
                  <span>{{ item.name }} <span class="font-normal">[{{ item.type }}]</span></span>
                  <span class="text-gray-600">X{{ item.qty }}</span>
                </div>
              </div>

              <!-- เส้นประแบ่งส่วน -->
              <div class="border-t border-dashed border-gray-300 my-4"></div>

              <!-- ตัวเลือกเพิ่มเติม (น้ำซุป / ระดับความเผ็ด) -->
              <div class="text-[13px] text-gray-400 space-y-1.5 font-medium">
                <p v-if="bill.options.soup">ต้ม: {{ bill.options.soup }}</p>
                <p v-if="bill.options.grill">ย่าง: {{ bill.options.grill }}</p>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

// ==========================================
// 📌 ส่วนจัดการข้อมูล (เตรียมเชื่อมต่อ Database)
// ==========================================

const tableNumber = ref('01');
const bills = ref([]);

// คำนวณราคารวมของทุกบิลอัตโนมัติ
const grandTotal = computed(() => {
  return bills.value.reduce((sum, bill) => sum + bill.totalPrice, 0).toLocaleString();
});

// ฟังก์ชันจำลองการดึงข้อมูลจาก Database / API
const fetchBillData = async () => {
  try {
    // โครงสร้าง Mock Data
    const mockDataFromDB = [
      {
        id: 'b_001',
        billNumber: 1,
        totalPrice: 6666,
        items: [
          { id: 'i_01', name: 'หมูสามชั้นสไลซ์/3 ชิ้น', type: 'ต้ม', qty: 5 },
          { id: 'i_02', name: 'ผ้าขี้ริ้ววัว/3ชิ้น', type: 'ต้ม', qty: 5 },
          { id: 'i_03', name: 'เต้าหู้ไข่/3 ชิ้น', type: 'ต้ม', qty: 5 },
          { id: 'i_04', name: 'ไส้วัว', type: 'ย่าง', qty: 5 },
        ],
        options: {
          soup: 'หม่าล่า [เผ็ดน้อย]',
          grill: '[เผ็ดกลาง]'
        }
      },
      {
        id: 'b_002',
        billNumber: 2,
        totalPrice: 3333,
        items: [
          { id: 'i_05', name: 'หมูสามชั้นสไลซ์/3 ชิ้น', type: 'ต้ม', qty: 5 },
          { id: 'i_06', name: 'ผ้าขี้ริ้ววัว/3ชิ้น', type: 'ต้ม', qty: 5 },
          { id: 'i_07', name: 'เต้าหู้ไข่/3 ชิ้น', type: 'ต้ม', qty: 5 },
        ],
        options: {
          soup: 'หม่าล่า [เผ็ดน้อย]',
          grill: ''
        }
      }
    ];

    bills.value = mockDataFromDB;
  } catch (error) {
    console.error('ไม่สามารถดึงข้อมูลบิลได้:', error);
  }
};

// ดึงข้อมูลเมื่อ Component ถูกโหลด
onMounted(() => {
  fetchBillData();
});
</script>

<style scoped>
/* แอนิเมชันตอนเปิด/ปิด Popup */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-from > div, .fade-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>