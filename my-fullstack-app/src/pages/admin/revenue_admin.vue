<template>
  <div class="revenue-container">
    <section class="stats-grid">
      <div class="stat-card day">
        <span class="stat-label">รายได้รายวัน</span>
        <h2 class="stat-value">฿{{ stats.daily.toLocaleString() }}</h2>
        <span class="stat-compare">เทียบกับเมื่อวาน +5%</span>
      </div>
      <div class="stat-card week">
        <span class="stat-label">รายได้รายอาทิตย์</span>
        <h2 class="stat-value">฿{{ stats.weekly.toLocaleString() }}</h2>
        <span class="stat-compare">7 วันที่ผ่านมา</span>
      </div>
      <div class="stat-card month">
        <span class="stat-label">รายได้รายเดือน</span>
        <h2 class="stat-value">฿{{ stats.monthly.toLocaleString() }}</h2>
        <span class="stat-compare">กุมภาพันธ์ 2026</span>
      </div>
    </section>

    <section class="history-section shadow-sm">
      <div class="history-header">
        <h2 class="section-title">ประวัติบิลย้อนหลัง</h2>
        <div class="filter-group">
          <input type="date" v-model="filterDate" class="date-input" />
          <button class="export-btn">ส่งออกรายงาน</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>เลขที่บิล</th>
              <th>โต๊ะ</th>
              <th>เวลา</th>
              <th>รายการอาหาร</th>
              <th>ยอดรวม</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bill in billHistory" :key="bill.id">
              <td class="bill-id">#{{ bill.billNo }}</td>
              <td>โต๊ะ {{ bill.tableNo }}</td>
              <td>{{ bill.time }}</td>
              <td class="items-cell">
                <span class="item-summary">{{ bill.itemsCount }} รายการ</span>
              </td>
              <td class="amount-cell">฿{{ bill.total.toLocaleString() }}</td>
              <td><span class="status-tag paid">ชำระแล้ว</span></td>
              <td>
                <button class="detail-link" @click="viewDetail(bill)">ดูบิล</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// ข้อมูลจำลองสถิติ
const stats = ref({
  daily: 4500,
  weekly: 32000,
  monthly: 125000
});

const filterDate = ref(new Date().toISOString().substr(0, 10));

// ข้อมูลจำลองประวัติบิล
const billHistory = ref([
  { id: 101, billNo: '6901', tableNo: '01', time: '18:45', itemsCount: 12, total: 1550 },
  { id: 102, billNo: '6902', tableNo: '03', time: '19:12', itemsCount: 5, total: 420 },
  { id: 103, billNo: '6903', tableNo: '02', time: '19:30', itemsCount: 8, total: 890 },
  { id: 104, billNo: '6904', tableNo: '05', time: '20:05', itemsCount: 15, total: 2100 },
]);

const viewDetail = (bill) => {
  alert(`เปิดดูรายละเอียดบิล #${bill.billNo}`);
};
</script>

<style scoped>
.revenue-container {
  max-width: 1100px;
  margin: 0 auto;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  border-bottom: 5px solid transparent;
}

.stat-card.day { border-bottom-color: #f97316; }
.stat-card.week { border-bottom-color: #3b82f6; }
.stat-card.month { border-bottom-color: #10b981; }

.stat-label { color: #718096; font-size: 14px; margin-bottom: 10px; }
.stat-value { font-size: 32px; font-weight: 700; color: #1a202c; margin-bottom: 5px; }
.stat-compare { font-size: 12px; color: #a0aec0; }

/* History Table Section */
.history-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-title { font-size: 20px; color: #2d3748; }

.filter-group { display: flex; gap: 15px; }
.date-input { padding: 8px 15px; border-radius: 8px; border: 1px solid #e2e8f0; }

.export-btn {
  background: #4a5568;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

/* Table Design */
.table-wrapper { overflow-x: auto; }
.history-table { width: 100%; border-collapse: collapse; text-align: left; }
.history-table th { padding: 15px; border-bottom: 2px solid #edf2f7; color: #718096; font-weight: 600; font-size: 14px; }
.history-table td { padding: 18px 15px; border-bottom: 1px solid #edf2f7; font-size: 15px; color: #2d3748; }

.bill-id { font-weight: 700; color: #f97316; }
.amount-cell { font-weight: 700; }
.status-tag.paid { background: #def7ec; color: #03543f; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }

.detail-link {
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}
</style>