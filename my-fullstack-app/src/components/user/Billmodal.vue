<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container">
        
        <header class="modal-header">
          <button class="icon-btn back-btn" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="header-title">ประวัติการสั่งอาหาร</h2>
          <div style="width: 40px;"></div> 
        </header>

        <main class="modal-body">
          
          <div v-if="cartStore.bills.length === 0" class="empty-state">
            <span class="text-4xl mb-2 block">🧾</span>
            ยังไม่มีประวัติการสั่งอาหาร
          </div>

          <div v-else class="bills-list">
            <div v-for="(bill, index) in cartStore.bills" :key="bill.id" class="bill-card">
              
              <div class="bill-header">
                <h3 class="round-title">รอบที่ {{ index + 1 }}</h3>
                <span class="bill-time">{{ formatTime(bill.timestamp) }}</span>
              </div>

              <ul class="item-list">
                <li v-for="item in bill.items" :key="item.id + item.typeAddedAs" class="item-row">
                  <div class="item-name">
                    <span class="qty">{{ item.quantity }}x</span>
                    {{ item.name }}
                    <span class="item-type">({{ item.typeAddedAs === 'boil' ? 'ต้ม' : 'ย่าง' }})</span>
                  </div>
                  <div class="item-price">{{ item.price * item.quantity }}฿</div>
                </li>
              </ul>

              <div class="options-summary" v-if="bill.options.boil || bill.options.grill">
                <p v-if="bill.options.boil" class="option-text">🍲 {{ formatBoilOption(bill.options.boil) }}</p>
                <p v-if="bill.options.grill" class="option-text">🔥 ย่าง: {{ formatGrillOption(bill.options.grill) }}</p>
              </div>

              <div class="bill-total">
                <span>รวมรอบนี้</span>
                <span class="total-price">{{ bill.totalPrice }}฿</span>
              </div>

            </div>
          </div>
        </main>

        <footer class="modal-footer" v-if="cartStore.bills.length > 0">
          <div class="grand-total-box">
            <div class="grand-total-text">
              <span class="title">ยอดรวมทั้งหมด ({{ cartStore.orderCount }} รอบ)</span>
              <span class="price">{{ cartStore.grandTotalPrice }}฿</span>
            </div>
            <button class="call-bill-btn" @click="$emit('close')">ปิดหน้าต่าง</button>
          </div>
        </footer>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useCartStore } from '../../stores/cartStore';

const cartStore = useCartStore();

defineEmits(['close']);

// ฟังก์ชันแปลงเวลาให้สวยงาม (เช่น 14:30 น.)
const formatTime = (dateObj) => {
  if (!dateObj) return '';
  const d = new Date(dateObj);
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
};

// ฟังก์ชันแปลงข้อความตัวเลือกต้มให้เป็นภาษาไทยอ่านง่าย
const formatBoilOption = (optionStr) => {
  if (!optionStr) return '';
  let text = optionStr;
  text = text.replace('original', 'ซุปหม่าล่าดั้งเดิม');
  text = text.replace('milk', 'ซุปหม่าล่านม');
  text = text.replace(/\[(\d+)\]/, '(เผ็ดระดับ $1)');
  return text;
};

// ฟังก์ชันแปลงข้อความตัวเลือกย่าง
const formatGrillOption = (optionStr) => {
  if (!optionStr) return '';
  return optionStr.replace(/\[(\d+)\]/, 'เผ็ดระดับ $1');
};
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: flex-end; z-index: 9999; }
.modal-container { position: relative; width: 100%; max-width: 480px; height: 95vh; background-color: #f7f8fa; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; overflow: hidden; animation: slideUp 0.3s ease-out; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: #fff; border-bottom: 1px solid #f0f0f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.header-title { margin: 0; font-size: 1.1rem; font-weight: bold; color: #333; }
.icon-btn { background: none; border: none; cursor: pointer; color: #333; display: flex; align-items: center; justify-content: center; padding: 8px; }

.modal-body { flex: 1; overflow-y: auto; padding: 16px; }

.empty-state { text-align: center; padding: 60px 20px; color: #888; font-size: 1rem; }

/* การ์ดบิลแต่ละใบ */
.bill-card { background-color: #fff; border-radius: 16px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f0f0f0; }
.bill-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #e0e0e0; }
.round-title { margin: 0; font-size: 1.05rem; font-weight: bold; color: #c62828; }
.bill-time { font-size: 0.85rem; color: #888; }

.item-list { list-style: none; padding: 0; margin: 0 0 12px 0; }
.item-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; font-size: 0.95rem; color: #333; }
.qty { font-weight: bold; color: #c62828; margin-right: 8px; display: inline-block; width: 24px; }
.item-type { font-size: 0.8rem; color: #888; margin-left: 4px; }
.item-price { font-weight: bold; color: #000; }

.options-summary { background-color: #f9fafb; padding: 10px; border-radius: 8px; margin-bottom: 12px; }
.option-text { margin: 0 0 4px 0; font-size: 0.85rem; color: #555; }
.option-text:last-child { margin-bottom: 0; }

.bill-total { display: flex; justify-content: space-between; align-items: center; font-size: 1rem; color: #333; padding-top: 10px; border-top: 1px dashed #e0e0e0; }
.total-price { font-size: 1.1rem; font-weight: bold; color: #c62828; }

/* แถบยอดรวมด้านล่างสุด */
.modal-footer { background-color: #fff; padding: 16px; box-shadow: 0 -4px 12px rgba(0,0,0,0.05); }
.grand-total-box { display: flex; flex-direction: column; gap: 12px; }
.grand-total-text { display: flex; justify-content: space-between; align-items: center; }
.grand-total-text .title { font-size: 1rem; font-weight: bold; color: #555; }
.grand-total-text .price { font-size: 1.4rem; font-weight: bold; color: #000; }

.call-bill-btn { width: 100%; background-color: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; }
</style>