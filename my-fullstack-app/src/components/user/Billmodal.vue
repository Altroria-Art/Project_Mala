<script setup>
import { useCartStore } from '../../stores/cartStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const cartStore = useCartStore();

// ฟังก์ชันแปลงประเภทให้เป็นภาษาไทยแสดงผลสวยๆ
const getTypeLabel = (type) => {
  return type === 'boil' ? '[ต้ม]' : '[ย่าง]';
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center">
    <!-- ฉากหลังคลิกเพื่อปิด -->
    <div class="absolute inset-0 bg-black/60" @click="emit('close')"></div>
    
    <!-- ตัวกล่อง Modal -->
    <div class="relative w-[92%] max-w-[380px] h-[80vh] bg-white rounded-[24px] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
      
      <!-- ส่วน Header: โต๊ะ และ ราคารวมทั้งหมด -->
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <!-- ปุ่มโต๊ะ (สีน้ำเงินเข้มตาม Figma) -->
        <div class="bg-[#2B1C5B] text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm">
          โต๊ะ 01
        </div>
        
        <div class="text-right">
          <div class="text-[11px] text-gray-500 font-medium">ราคาทั้งหมด</div>
          <div class="text-lg font-bold text-gray-800 leading-none">{{ cartStore.grandTotalPrice }}฿</div>
        </div>
      </div>

      <!-- ส่วนรายการบิล (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-4 bg-[#F8F9FA]">
        
        <div v-if="cartStore.bills.length > 0" class="flex flex-col gap-4">
          <!-- วนลูปแสดงแต่ละบิล -->
          <div v-for="bill in cartStore.bills" :key="bill.id" class="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50">
            
            <!-- หัวบิล: หมายเลขบิล & ราคา -->
            <div class="flex justify-between items-center mb-4">
              <div class="bg-[#F87171] text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm">
                บิลที่ {{ bill.id }}
              </div>
              <div class="text-sm font-bold text-gray-800">
                ราคา <span class="text-base ml-1">{{ bill.totalPrice }}฿</span>
              </div>
            </div>

            <!-- รายการอาหารในบิล -->
            <div class="flex flex-col gap-2 mb-4">
              <div v-for="(item, index) in bill.items" :key="index" class="flex justify-between items-start text-[13px] text-gray-700">
                <div class="flex-1 pr-4">
                  {{ item.name }} <span class="text-gray-400">{{ getTypeLabel(item.typeAddedAs) }}</span>
                </div>
                <div class="font-medium text-gray-900">X{{ item.quantity }}</div>
              </div>
            </div>

            <!-- เส้นประคั่น -->
            <div class="border-t border-dashed border-gray-300 my-3"></div>

            <!-- สรุปตัวเลือก น้ำซุป/ความเผ็ด ของบิลนี้ -->
            <div class="text-[12px] text-gray-500 space-y-1">
              <div v-if="bill.options.boil">
                <span class="font-medium text-gray-600">ต้ม:</span> หม่าล่า {{ bill.options.boil }}
              </div>
              <div v-if="bill.options.grill">
                <span class="font-medium text-gray-600">ย่าง:</span> {{ bill.options.grill }}
              </div>
            </div>

          </div>
        </div>

        <!-- แจ้งเตือนเมื่อยังไม่มีการสั่งซื้อ -->
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-3 opacity-30">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p class="text-sm font-medium text-gray-500">ยังไม่มีรายการบิล</p>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); scale: 0.95; }
  to { opacity: 1; transform: translateY(0); scale: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>