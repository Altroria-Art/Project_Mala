<template>
  <div>
    <div class="queue-grid">
      <div class="order-card" v-for="order in queueList" :key="order.id">
        <div class="card-side-accent"></div>
        
        <div class="card-content">
          <div class="card-header">
            <div class="badges-group">
              <span class="badge table-id">โต๊ะ {{ order.tableNo }}</span>
              <span class="badge bill-no">บิลที่ {{ order.billNo }}</span>
            </div>
            <div class="order-time">{{ order.time }} น.</div>
          </div>

          <ul class="order-items-list">
            <li v-for="(item, index) in order.items.slice(0, 5)" :key="index" class="item-row">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x {{ item.qty }}</span>
            </li>
            
            <li class="more-indicator clickable" v-if="order.items.length > 5" @click="openModal(order)">
              ดูเพิ่มเติมอีก {{ order.items.length - 5 }} รายการ <span>👆</span>
            </li>
          </ul>

          <div class="note-container" v-if="order.notes && order.notes.length > 0">
            <p v-for="(note, nIndex) in order.notes" :key="nIndex">
              📌 {{ note }}
            </p>
          </div>

          <button class="cook-action-btn" @click="openConfirmCookModal(order)">
            ปรุงอาหารเสร็จ
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div class="modal-overlay" v-if="isModalOpen" @click.self="closeModal">
        <div class="modal-content view-bill-modal">
          <div class="modal-header">
            <h3>ออเดอร์ โต๊ะ {{ selectedOrder?.tableNo }} - บิลที่ {{ selectedOrder?.billNo }}</h3>
            <button class="close-btn" @click="closeModal">✕</button>
          </div>
          
          <div class="modal-body">
            <ul class="full-items-list">
              <li v-for="(item, index) in selectedOrder?.items" :key="index" class="item-row">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-qty">x {{ item.qty }}</span>
              </li>
            </ul>
            
            <div class="note-container" v-if="selectedOrder?.notes && selectedOrder?.notes.length > 0">
              <p v-for="(note, nIndex) in selectedOrder?.notes" :key="nIndex">
                📌 {{ note }}
              </p>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="cook-action-btn" @click="openConfirmCookFromView(selectedOrder)">
              ปรุงอาหารเสร็จ (ปิดบิล)
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal-overlay" v-if="isConfirmCookModalOpen" @click.self="closeConfirmCookModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>ยืนยันสถานะออเดอร์</h3>
            <button class="close-btn" @click="closeConfirmCookModal">✕</button>
          </div>
          
          <div class="modal-body confirm-modal-body">
            <h2>ปรุงอาหารเสร็จแล้ว?</h2>
            <p>ยืนยันว่าออเดอร์ของ <strong>โต๊ะ {{ selectedOrderForCook?.tableNo }} (บิลที่ {{ selectedOrderForCook?.billNo }})</strong> ปรุงเสร็จและพร้อมเสิร์ฟแล้วใช่หรือไม่?</p>
          </div>
          
          <div class="modal-footer action-buttons">
            <button class="cancel-btn" @click="closeConfirmCookModal">ยกเลิก</button>
            <button class="confirm-action-btn" @click="executeCookOrder">ยืนยันพร้อมเสิร์ฟ</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal-overlay" v-if="isSuccessModalOpen" @click.self="closeSuccessModal">
        <div class="modal-content success-modal">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>สำเร็จ!</h2>
          <p>{{ successMessage }}</p>
          <button class="success-ok-btn" @click="closeSuccessModal">ตกลง</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminService } from '../../services/adminService';

const queueList = ref([]);

const isModalOpen = ref(false);
const selectedOrder = ref(null);

const isConfirmCookModalOpen = ref(false);
const selectedOrderForCook = ref(null);

const isSuccessModalOpen = ref(false);
const successMessage = ref('');

const loadQueue = async () => {
  try {
    const rawData = await adminService.getQueue();
    if (!Array.isArray(rawData)) return;
    
    const tableBillCount = {};

    queueList.value = rawData.map(order => {
      const notes = [];
      if (order.soup_type) notes.push(`น้ำซุป: ${order.soup_type}`);
      if (order.spicy_boiled) notes.push(`[ต้ม] ${order.spicy_boiled}`);
      if (order.spicy_grilled) notes.push(`[ย่าง] ${order.spicy_grilled}`);

      let timeString = 'ไม่ระบุเวลา';
      if (order.created_at) {
        const utcString = order.created_at.replace(' ', 'T') + 'Z';
        timeString = new Date(utcString).toLocaleTimeString('th-TH', { 
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok'
        });
      }

      const tableId = order.table_id || 0;
      if (!tableBillCount[tableId]) tableBillCount[tableId] = 0;
      tableBillCount[tableId]++; 

      return {
        id: order.id,
        tableNo: String(tableId).padStart(2, '0'),
        billNo: tableBillCount[tableId], 
        time: timeString,
        notes: notes,
        items: (order.items || []).map(item => ({
          name: item.product_name, 
          qty: item.quantity
        }))
      };
    });
  } catch (error) {
    console.error("Failed to load queue:", error);
  }
};

onMounted(() => {
  loadQueue();
  setInterval(loadQueue, 30000); 
});

const openModal = (order) => {
  selectedOrder.value = order;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedOrder.value = null;
};

const showSuccessModal = (message) => {
  successMessage.value = message;
  isSuccessModalOpen.value = true;
};

const closeSuccessModal = () => {
  isSuccessModalOpen.value = false;
};

const openConfirmCookModal = (order) => {
  selectedOrderForCook.value = order;
  isConfirmCookModalOpen.value = true;
};

const closeConfirmCookModal = () => {
  isConfirmCookModalOpen.value = false;
  selectedOrderForCook.value = null;
};

const openConfirmCookFromView = (order) => {
  closeModal(); 
  openConfirmCookModal(order);
};

const executeCookOrder = async () => {
  if (!selectedOrderForCook.value) return;

  try {
    await adminService.updateOrderStatus(selectedOrderForCook.value.id, 'served'); 
    await loadQueue(); 
    closeConfirmCookModal();

    setTimeout(() => {
      showSuccessModal('อัปเดตสถานะพร้อมเสิร์ฟเรียบร้อย!');
    }, 200);

  } catch (error) {
    console.error("Error updating status:", error);
    alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
  }
};
</script>

<style scoped>
.queue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; width: 100%; }
.order-card { background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); display: flex; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.order-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.card-side-accent { width: 8px; background: linear-gradient(to bottom, #ffc0cb, #ff8a8a); }
.card-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.badges-group { display: flex; gap: 8px; }
.badge { padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 700; color: white; }
.table-id { background-color: #312e81; }
.bill-no { background-color: #ef4444; }
.order-time { font-size: 12px; color: #6b7280; font-weight: 500; }
.order-items-list { list-style: none; padding: 0; margin: 0 0 20px 0; flex: 1; }
.item-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #f3f4f6; font-size: 15px; color: #374151; }
.item-qty { font-weight: 700; color: #111827; }
.note-container { background-color: #f9fafb; padding: 12px; border-radius: 10px; font-size: 13px; color: #4b5563; margin-bottom: 20px; border-left: 4px solid #d1d5db; }
.cook-action-btn { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); color: white; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); margin-top: auto;}
.cook-action-btn:hover { filter: brightness(1.1); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }
.cook-action-btn:active { transform: scale(0.98); }

.more-indicator { text-align: center; margin-top: 10px; padding: 8px; border-radius: 8px; background-color: #f0fdf4; color: #16a34a; font-size: 13px; }
.more-indicator.clickable { cursor: pointer; font-weight: 600; border: 1px dashed #86efac; transition: all 0.2s; }
.more-indicator.clickable:hover { background-color: #dcfce7; color: #15803d; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 9999; }
.modal-content { background: white; border-radius: 20px; width: 90%; max-width: 450px; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; }
.modal-header { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
.modal-header h3 { margin: 0; font-size: 16px; color: #1e293b; }
.close-btn { background: #f1f5f9; border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 14px; color: #64748b; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.2s; }
.close-btn:hover { background: #fee2e2; color: #ef4444; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.full-items-list { list-style: none; padding: 0; margin: 0 0 20px 0; }
.modal-footer { padding: 20px 24px; border-top: 1px solid #e5e7eb; background: #f8fafc; }

.confirm-modal-body { padding: 30px 20px; text-align: center; }
.warning-icon { font-size: 48px; margin-bottom: 10px; }
.confirm-modal-body h2 { margin: 0 0 10px 0; color: #1e293b; }
.confirm-modal-body p { color: #64748b; margin: 0 0 20px 0; line-height: 1.5; }
.action-buttons { display: flex; gap: 12px; padding: 20px; background: #f8fafc; }
.cancel-btn { flex: 1; padding: 12px; border: 1px solid #cbd5e1; background: white; color: #64748b; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.cancel-btn:hover { background: #f1f5f9; }
.confirm-action-btn { flex: 1; padding: 12px; border: none; background: #3b82f6; color: white; border-radius: 10px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); transition: transform 0.2s; }
.confirm-action-btn:active { transform: scale(0.96); }

.success-modal { padding: 40px 24px 30px 24px; text-align: center; max-width: 320px; border-radius: 20px;}
.success-icon { width: 70px; height: 70px; margin: 0 auto 20px; color: #10b981; }
.success-icon svg { width: 100%; height: 100%; }
.success-modal h2 { margin: 0 0 10px 0; color: #1e293b; font-size: 24px; font-weight: 700; }
.success-modal p { color: #64748b; margin: 0 0 30px 0; font-size: 16px; }
.success-ok-btn { background: #10b981; color: white; border: none; padding: 14px 30px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; width: 100%; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); transition: transform 0.2s, background 0.2s; }
.success-ok-btn:hover { background: #059669; }
.success-ok-btn:active { transform: scale(0.96); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>