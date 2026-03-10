<template>
  <div class="table-list-container">
    <div 
      v-for="table in tables" 
      :key="table.id" 
      class="table-accordion" 
      :class="{'is-expanded': expandedTableId === table.id, 'is-empty': table.status !== 'occupied'}"
    >
      <div 
        class="table-header-row" 
        @click="table.status === 'occupied' ? toggleExpand(table.id) : null"
      >
        <div class="table-info-left">
          <div class="table-badge">โต๊ะ {{ table.no }}</div>
          <div class="table-total" v-if="table.status === 'occupied'">
            ฿{{ getTableTotal(table).toLocaleString() }}
          </div>
          <div class="table-total empty-text" v-else>ว่าง</div>
        </div>
        
        <div class="table-info-right" v-if="table.status === 'occupied'">
          <span class="round-badge">{{ table.bills.length }} รอบบิล</span>
          <span class="arrow-icon" :class="{'rotate': expandedTableId === table.id}">∨</span>
        </div>
      </div>

      <transition name="expand">
        <div class="table-expanded-body" v-if="expandedTableId === table.id && table.bills.length > 0">
          <div class="bills-grid">
            <div v-for="(bill, index) in table.bills" :key="bill.id" class="bill-card">
              <div class="bill-card-header">
                <div>
                  <span class="bill-no-label">บิลที่ {{ index + 1 }}</span>
                  <span class="status-badge" :class="bill.status">{{ getStatusText(bill.status) }}</span>
                </div>
                <span class="bill-amount">฿{{ getBillTotal(bill).toLocaleString() }}</span>
              </div>
              
              <div class="bill-items-list">
                <div class="bill-item-row" v-for="(item, idx) in bill.items.slice(0, 5)" :key="idx">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-qty">x{{ item.qty }}</span>
                </div>
                
                <div 
                  class="more-indicator clickable" 
                  v-if="bill.items.length > 5" 
                  @click="openViewBillModal(bill, index, table.no)"
                >
                  ดูเพิ่มเติมอีก {{ bill.items.length - 5 }} รายการ <span>👆</span>
                </div>

                <div class="receipt-dots">. . . . . . . . . . .</div>
              </div>

              <button class="pay-single-btn" @click="openSinglePayModal(bill)">ชำระบิลนี้</button>
            </div>
          </div>

          <button class="pay-all-btn" @click="openPayModal(table.id)">
            ชำระบิลทั้งหมดบนโต๊ะนี้ (฿{{ getTableTotal(table).toLocaleString() }})
          </button>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div class="modal-overlay" v-if="isViewBillModalOpen" @click.self="closeViewBillModal">
        <div class="modal-content view-bill-modal">
          <div class="modal-header">
            <h3>รายละเอียดบิล - โต๊ะ {{ selectedTableNoForView }} (บิลที่ {{ selectedBillIndex + 1 }})</h3>
            <button class="close-btn" @click="closeViewBillModal">✕</button>
          </div>
          
          <div class="modal-body view-bill-body">
            <div class="full-items-list">
              <div class="bill-item-row" v-for="(item, idx) in selectedBillForView?.items" :key="idx">
                <span class="item-name">{{ item.name }}</span>
                <div class="item-right-group">
                  <span class="item-qty">x{{ item.qty }}</span>
                  <span class="item-price">฿{{ (item.qty * item.price).toLocaleString() }}</span>
                </div>
              </div>
            </div>
            
            <div class="receipt-dots">. . . . . . . . . . . . . . . . . . . . .</div>
            
            <div class="bill-total-row">
              <span>ยอดรวมบิลนี้</span>
              <span class="total-amount">฿{{ selectedBillForView ? getBillTotal(selectedBillForView).toLocaleString() : 0 }}</span>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="pay-single-btn full-width" @click="payBillFromModal(selectedBillForView)">
              ชำระบิลนี้เลย
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal-overlay" v-if="isSinglePayModalOpen" @click.self="closeSinglePayModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>ยืนยันการชำระเงินบิลเดี่ยว</h3>
            <button class="close-btn" @click="closeSinglePayModal">✕</button>
          </div>
          
          <div class="modal-body confirm-pay-body">
            <h2>ชำระบิลนี้</h2>
            <p>ต้องการชำระเงินสำหรับบิลรายการนี้ใช่หรือไม่?</p>
            <div class="total-highlight single-bill-highlight">
              ยอดรวมบิลนี้: <span>฿{{ selectedSingleBill ? getBillTotal(selectedSingleBill).toLocaleString() : 0 }}</span>
            </div>
          </div>
          
          <div class="modal-footer action-buttons">
            <button class="cancel-btn" @click="closeSinglePayModal">ยกเลิก</button>
            <button class="confirm-pay-btn single-pay-btn" @click="executePaySingleBill">ยืนยันการชำระเงิน</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal-overlay" v-if="isPayModalOpen" @click.self="closePayModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>ยืนยันการชำระเงินรวบยอด</h3>
            <button class="close-btn" @click="closePayModal">✕</button>
          </div>
          
          <div class="modal-body confirm-pay-body">
            <h2>ชำระเงินรวบยอด</h2>
            <p>ต้องการชำระเงินรวบยอดสำหรับ <strong>โต๊ะ {{ selectedTableForPay?.no }}</strong> ใช่หรือไม่?</p>
            <div class="total-highlight">
              ยอดรวมทั้งหมด: <span>฿{{ selectedTableForPay ? getTableTotal(selectedTableForPay).toLocaleString() : 0 }}</span>
            </div>
          </div>
          
          <div class="modal-footer action-buttons">
            <button class="cancel-btn" @click="closePayModal">ยกเลิก</button>
            <button class="confirm-pay-btn" @click="executePayTable">ยืนยันการชำระเงิน</button>
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

const expandedTableId = ref(null);
const tables = ref([]);

const isViewBillModalOpen = ref(false);
const selectedBillForView = ref(null);
const selectedBillIndex = ref(0);
const selectedTableNoForView = ref('');

const isPayModalOpen = ref(false);
const selectedTableForPay = ref(null);

const isSinglePayModalOpen = ref(false);
const selectedSingleBill = ref(null);

const isSuccessModalOpen = ref(false);
const successMessage = ref('');

const toggleExpand = (id) => {
  expandedTableId.value = expandedTableId.value === id ? null : id;
};

const loadTables = async () => {
  try {
    const rawData = await adminService.getTableBills();
    if (!Array.isArray(rawData)) return;

    const tableMap = new Map();
    for (let i = 1; i <= 5; i++) {
      tableMap.set(i, { id: i, no: String(i).padStart(2, '0'), status: 'empty', bills: [] });
    }

    rawData.forEach(order => {
      if (order.status !== 'served') return; 

      const tableId = order.table_id;
      if (tableMap.has(tableId)) {
        const table = tableMap.get(tableId);
        table.status = 'occupied';
        
        table.bills.push({
          id: order.id,
          status: order.status, 
          items: (order.items || []).map(item => ({
            name: item.product_name,
            qty: item.quantity,
            price: item.subtotal_price / item.quantity
          }))
        });
      }
    });

    tables.value = Array.from(tableMap.values());

  } catch (error) {
    console.error("Failed to load tables:", error);
  }
};

onMounted(() => {
  loadTables();
  setInterval(loadTables, 10000); 
});

const getBillTotal = (bill) => bill.items.reduce((sum, i) => sum + (i.qty * i.price), 0);
const getTableTotal = (table) => table.bills.reduce((sum, b) => sum + getBillTotal(b), 0);

const getStatusText = (status) => {
  const statusMap = {
    'unpaid': 'รอทำ',
    'cooking': 'กำลังทำ', 
    'served': 'เสิร์ฟแล้ว'
  };
  return statusMap[status] || status;
};

const showSuccessModal = (message) => {
  successMessage.value = message;
  isSuccessModalOpen.value = true;
};

const closeSuccessModal = () => {
  isSuccessModalOpen.value = false;
};

const openSinglePayModal = (bill) => {
  selectedSingleBill.value = bill;
  isSinglePayModalOpen.value = true;
};

const closeSinglePayModal = () => {
  isSinglePayModalOpen.value = false;
  selectedSingleBill.value = null;
};

const executePaySingleBill = async () => {
  if (!selectedSingleBill.value) return;
  const targetBillId = selectedSingleBill.value.id; 

  try {
    await adminService.updateOrderStatus(targetBillId, 'paid');

    tables.value.forEach(table => {
      const hasBill = table.bills.some(b => b.id === targetBillId);
      if (hasBill) {
        table.bills = table.bills.filter(b => b.id !== targetBillId);

        if (table.bills.length === 0) {
          table.status = 'empty';
          if (expandedTableId.value === table.id) {
            expandedTableId.value = null; // ปิด Accordion ทันที
          }
        }
      }
    });

    closeSinglePayModal(); 

    setTimeout(() => {
      showSuccessModal('ชำระเงินบิลเรียบร้อยแล้ว!'); 
    }, 200);

    loadTables();

  } catch (error) {
    console.error("Error paying single bill:", error);
    alert('เกิดข้อผิดพลาดในการชำระเงิน');
  }
};

const openViewBillModal = (bill, index, tableNo) => {
  selectedBillForView.value = bill;
  selectedBillIndex.value = index;
  selectedTableNoForView.value = tableNo;
  isViewBillModalOpen.value = true;
};

const closeViewBillModal = () => {
  isViewBillModalOpen.value = false;
  selectedBillForView.value = null;
};

const payBillFromModal = (bill) => {
  closeViewBillModal();
  openSinglePayModal(bill);
};

const openPayModal = (tableId) => {
  const table = tables.value.find(t => t.id === tableId);
  if (!table || table.bills.length === 0) return;
  
  selectedTableForPay.value = table;
  isPayModalOpen.value = true;
};

const closePayModal = () => {
  isPayModalOpen.value = false;
  selectedTableForPay.value = null;
};

const executePayTable = async () => {
  if (!selectedTableForPay.value) return;
  const targetTableId = selectedTableForPay.value.id;

  try {
    const promises = selectedTableForPay.value.bills.map(bill => adminService.updateOrderStatus(bill.id, 'paid'));
    await Promise.all(promises);

    const tableIndex = tables.value.findIndex(t => t.id === targetTableId);
    if (tableIndex !== -1) {
      tables.value[tableIndex].bills = [];
      tables.value[tableIndex].status = 'empty';
    }

    expandedTableId.value = null; 
    closePayModal(); 
    
    setTimeout(() => {
      showSuccessModal('ชำระเงินรวบยอดสำเร็จ!');
    }, 200);
    
    loadTables();

  } catch (error) {
    console.error("Error paying table:", error);
    alert('เกิดข้อผิดพลาดในการชำระเงินรวบยอด');
  }
};
</script>

<style scoped>
.status-badge { font-size: 11px; padding: 3px 8px; border-radius: 12px; margin-left: 8px; font-weight: 600; }
.status-badge.unpaid { background: #fee2e2; color: #ef4444; }
.status-badge.cooking { background: #d1fae5; color: #10b981; }
.status-badge.served { background: #d1fae5; color: #10b981; }

.table-list-container { display: flex; flex-direction: column; gap: 16px; max-width: 1000px; margin: 0 auto; }
.table-accordion { background: white; border-radius: 50px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; transition: all 0.3s ease; border: 1px solid transparent; }
.table-accordion.is-expanded { border-radius: 30px; border-color: #fbd38d; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.table-header-row { padding: 18px 40px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.table-badge { background: #ff6b6b; color: white; padding: 8px 24px; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 6px rgba(255, 107, 107, 0.3); }
.table-total { font-size: 22px; font-weight: 700; color: #2d3748; margin-left: 20px; }
.empty-text { color: #a0aec0; font-weight: 400; }
.round-badge { background: #edf2f7; color: #4a5568; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: 500; }
.arrow-icon { font-size: 18px; transition: transform 0.3s ease; margin-left: 15px; display: inline-block; }
.arrow-icon.rotate { transform: rotate(180deg); }
.table-expanded-body { padding: 0 40px 35px 40px; background: #fff; }
.bills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin: 20px 0 30px 0; }
.bill-card { background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.bill-card-header { display: flex; justify-content: space-between; margin-bottom: 15px; align-items: center; }
.bill-no-label { background: #ff8a8a; color: white; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; }
.bill-amount { font-weight: 700; color: #1a202c; }
.bill-item-row { display: flex; justify-content: space-between; font-size: 13px; color: #4a5568; margin-bottom: 6px; }
.receipt-dots { text-align: center; color: #cbd5e0; margin: 10px 0; }
.pay-single-btn { background: #4a5568; color: white; border: none; padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer; margin-top: auto; transition: background 0.2s; }
.pay-single-btn:hover { background: #2d3748; }
.pay-all-btn { width: 100%; background: linear-gradient(135deg, #f87171 0%, #ef4444 100%); color: white; border: none; padding: 18px; border-radius: 40px; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3); transition: transform 0.2s; }
.pay-all-btn:active { transform: scale(0.98); }

.more-indicator { text-align: center; margin-top: 5px; padding: 6px; border-radius: 8px; background-color: #f0f9ff; color: #0284c7; font-size: 12px; }
.more-indicator.clickable { cursor: pointer; font-weight: 600; border: 1px dashed #bae6fd; transition: all 0.2s; }
.more-indicator.clickable:hover { background-color: #e0f2fe; color: #0369a1; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 9999; }
.modal-content { background: white; border-radius: 20px; width: 90%; max-width: 400px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; display: flex; flex-direction: column; }
.modal-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { margin: 0; font-size: 16px; color: #1e293b; }
.close-btn { background: #f8fafc; border: none; width: 28px; height: 28px; border-radius: 50%; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.close-btn:hover { background: #fee2e2; color: #ef4444; }

.view-bill-modal { max-height: 85vh; }
.view-bill-body { padding: 24px; overflow-y: auto; flex: 1; }
.item-right-group { display: flex; gap: 15px; }
.item-price { color: #64748b; font-weight: 500; min-width: 40px; text-align: right; }
.bill-total-row { display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 10px; }
.bill-total-row .total-amount { color: #ef4444; font-size: 20px; }
.full-width { width: 100%; padding: 14px; font-size: 16px; }

.confirm-pay-body { padding: 30px 20px; text-align: center; }
.warning-icon { font-size: 48px; margin-bottom: 10px; }
.confirm-pay-body h2 { margin: 0 0 10px 0; color: #1e293b; }
.confirm-pay-body p { color: #64748b; margin: 0 0 20px 0; }
.total-highlight { background: #fff1f2; padding: 15px; border-radius: 12px; color: #be123c; font-weight: 600; font-size: 16px; }
.total-highlight span { font-size: 24px; font-weight: 700; display: block; margin-top: 5px; }

.single-bill-highlight { background: #f0fdf4; color: #15803d; }
.single-pay-btn { background: #10b981; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); }

.action-buttons { display: flex; gap: 12px; padding: 20px; background: #f8fafc; }
.cancel-btn { flex: 1; padding: 12px; border: 1px solid #cbd5e1; background: white; color: #64748b; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.cancel-btn:hover { background: #f1f5f9; }
.confirm-pay-btn { flex: 1; padding: 12px; border: none; background: #ef4444; color: white; border-radius: 10px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3); transition: transform 0.2s; }
.confirm-pay-btn:active { transform: scale(0.96); }

.success-modal { padding: 40px 24px 30px 24px; text-align: center; max-width: 320px; }
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