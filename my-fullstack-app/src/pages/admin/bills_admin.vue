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
        <div class="table-expanded-body" v-if="expandedTableId === table.id">
          <div class="bills-grid">
            <div v-for="bill in table.bills" :key="bill.billNo" class="bill-card">
              <div class="bill-card-header">
                <span class="bill-no-label">บิลที่ {{ bill.billNo }}</span>
                <span class="bill-amount">฿{{ getBillTotal(bill).toLocaleString() }}</span>
              </div>
              
              <div class="bill-items-list">
                <div class="bill-item-row" v-for="(item, idx) in bill.items" :key="idx">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-qty">X{{ item.qty }}</span>
                </div>
                <div class="receipt-dots">. . . . . . . . . . .</div>
              </div>

              <button class="pay-single-btn">ชำระบิลนี้</button>
            </div>
          </div>

          <button class="pay-all-btn">
            ชำระบิลทั้งหมดบนโต๊ะนี้ (฿{{ getTableTotal(table).toLocaleString() }})
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const expandedTableId = ref(null);

const toggleExpand = (id) => {
  expandedTableId.value = expandedTableId.value === id ? null : id;
};

// ข้อมูลจำลอง (ปรับยอดเงินตามภาพตัวอย่างของคุณ)
const tables = ref([
  {
    id: 1, no: '01', status: 'occupied',
    bills: [
      { billNo: 1, items: [{ name: 'หมูสามชั้นสไลด์ [ต้ม]', qty: 5, price: 300 }, { name: 'ผ้าขี้ริ้ววัว [ต้ม]', qty: 5, price: 200 }] },
      { billNo: 2, items: [{ name: 'หมูสามชั้นสไลด์ [ต้ม]', qty: 5, price: 500 }] }
    ]
  },
  {
    id: 2, no: '02', status: 'occupied',
    bills: [
      { billNo: 1, items: [{ name: 'ชุดผักรวม', qty: 1, price: 300 }] }
    ]
  },
  { id: 3, no: '03', status: 'empty', bills: [] },
  { id: 4, no: '04', status: 'empty', bills: [] }
]);

const getBillTotal = (bill) => bill.items.reduce((sum, i) => sum + (i.qty * i.price), 0);
const getTableTotal = (table) => table.bills.reduce((sum, b) => sum + getBillTotal(b), 0);
</script>

<style scoped>
.table-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
}

/* การ์ดโต๊ะ */
.table-accordion {
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.table-accordion.is-expanded {
  border-radius: 30px;
  border-color: #fbd38d;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.table-header-row {
  padding: 18px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.table-badge {
  background: #ff6b6b;
  color: white;
  padding: 8px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 4px 6px rgba(255, 107, 107, 0.3);
}

.table-total {
  font-size: 22px;
  font-weight: 700;
  color: #2d3748;
  margin-left: 20px;
}

.empty-text { color: #a0aec0; font-weight: 400; }

.round-badge {
  background: #edf2f7;
  color: #4a5568;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.arrow-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
  margin-left: 15px;
  display: inline-block;
}

.arrow-icon.rotate { transform: rotate(180deg); }

/* บิลย่อยด้านใน */
.table-expanded-body {
  padding: 0 40px 35px 40px;
  background: #fff;
}

.bills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0 30px 0;
}

.bill-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.bill-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
}

.bill-no-label {
  background: #ff8a8a;
  color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.bill-amount { font-weight: 700; color: #1a202c; }

.bill-item-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 6px;
}

.receipt-dots { text-align: center; color: #cbd5e0; margin: 10px 0; }

.pay-single-btn {
  background: #4a5568;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.2s;
}

.pay-single-btn:hover { background: #2d3748; }

.pay-all-btn {
  width: 100%;
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  color: white;
  border: none;
  padding: 18px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
  transition: transform 0.2s;
}

.pay-all-btn:active { transform: scale(0.98); }

/* Animation */
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 1000px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; transform: translateY(-10px); }
</style>