<template>
  <div class="revenue-dashboard">
    <div class="header-section">
      <div class="date-badge">
        <span class="icon">📅</span> {{ formatDateTh(filterDate) }}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box blue">📈</div>
          <div class="trend up">+12.5% จากเมื่อวาน</div>
        </div>
        <span class="label">ยอดขายวันนี้</span>
        <h2 class="value">฿{{ summary.daily_amount.toLocaleString() }}</h2>
        <p class="update">อัปเดตล่าสุดเมื่อ 1 นาทีที่แล้ว</p>
      </div>

      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box green">📄</div>
        </div>
        <span class="label">จำนวนบิลวันนี้</span>
        <h2 class="value">{{ summary.daily_count }}</h2>
        <p class="update">จำนวนบิลทั้งหมดที่ชำระแล้ว</p>
      </div>

      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box purple">💰</div>
          <div class="trend up">+5.2% จากเดือนที่แล้ว</div>
        </div>
        <span class="label">ยอดขายเดือนนี้ (มี.ค.)</span>
        <h2 class="value">฿{{ summary.monthly_amount.toLocaleString() }}</h2>
        <p class="update">1 มี.ค. - 31 มี.ค. 2026</p>
      </div>

      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box orange">📊</div>
        </div>
        <span class="label">ยอดขายเฉลี่ยต่อวัน</span>
        <h2 class="value">฿{{ summary.avg_per_day.toLocaleString() }}</h2>
        <p class="update">คำนวณจากยอดเดือนนี้</p>
      </div>
    </div>

    <div class="content-card shadow-sm">
      <div class="card-controls">
        <div class="tab-group">
          <button 
            @click="viewMode = 'daily'" 
            :class="['tab-btn', { active: viewMode === 'daily' }]"
          >ประวัติบิลรายวัน</button>
          <button 
            @click="viewMode = 'items'" 
            :class="['tab-btn', { active: viewMode === 'items' }]"
          >สถิติวัตถุดิบรายวัน</button>
          <button 
            @click="viewMode = 'monthly'" 
            :class="['tab-btn', { active: viewMode === 'monthly' }]"
          >สรุปรายวัน (เดือนนี้)</button>
        </div>

        <div class="filter-group">
          <select v-if="viewMode === 'daily'" v-model="selectedTable" class="select-input">
            <option value="all">ดูทุกโต๊ะ</option>
            <option v-for="n in 5" :key="n" :value="n">โต๊ะ {{ n }}</option>
          </select>
          <select v-if="viewMode === 'items'" v-model="selectedCategory" class="select-input">
            <option value="all">ดูทุกหมวดหมู่</option>
            <option value="Meat">เนื้อสัตว์</option>
            <option value="vegetable">ผัก</option>
            <option value="Appetizer">ของกินเล่น</option>
          </select>
          <input type="date" v-model="filterDate" class="date-input" />
        </div>
      </div>

      <table v-if="viewMode === 'daily'" class="data-table">
        <thead>
          <tr>
            <th>เวลา</th>
            <th>เลขที่บิล</th>
            <th>โต๊ะ</th>
            <th class="text-right">ยอดเงิน (฿)</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bill in filteredHistory" :key="bill.id">
            <td><span class="time-tag">🕒 {{ formatTime(bill.created_at) }}</span></td>
            <td class="bold">INV-{{ bill.id }}</td>
            <td>โต๊ะ {{ bill.table_id }}</td>
            <td class="text-right bold">฿{{ bill.total_price.toLocaleString() }}</td>
            <td class="text-center">
              <button class="view-btn">ดูบิล</button>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-if="viewMode === 'items'" class="data-table">
        <thead>
          <tr>
            <th>อันดับ</th>
            <th>ชื่อวัตถุดิบ</th>
            <th>หมวดหมู่</th>
            <th class="text-center">จำนวนที่ขายได้</th>
            <th class="text-right">ยอดเงินรวม (฿)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in itemsStats" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="bold">{{ item.name }}</td>
            <td><span class="cat-tag">{{ item.category }}</span></td>
            <td class="text-center">{{ item.quantity || 0 }}</td>
            <td class="text-right bold">฿{{ (item.total || 0).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>

      <div class="card-footer">
        <p>แสดง {{ filteredHistory.length }} รายการ</p>
        <div class="page-nav">
          <button class="nav-btn" disabled>ก่อนหน้า</button>
          <button class="nav-btn active">1</button>
          <button class="nav-btn">ถัดไป</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const viewMode = ref('daily'); 
const summary = ref({ daily_amount: 0, daily_count: 0, monthly_amount: 0, avg_per_day: 0 });
const history = ref([]);
const itemsStats = ref([]); 
const filterDate = ref(new Date().toISOString().split('T')[0]);
const selectedTable = ref('all');
const selectedCategory = ref('all');

const fetchData = async () => {
  try {
    const sumRes = await fetch('http://127.0.0.1:8787/api/revenue/summary');
    summary.value = await sumRes.json();
    
    const histRes = await fetch(`http://127.0.0.1:8787/api/revenue/history?date=${filterDate.value}`);
    history.value = await histRes.json();
  } catch (e) {
    console.error("API Error:", e);
  }
};

const filteredHistory = computed(() => {
  if (selectedTable.value === 'all') return history.value;
  return history.value.filter(b => b.table_id == selectedTable.value);
});

watch(filterDate, fetchData);

const formatTime = (s) => new Date(s).toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit' });
const formatDateTh = (d) => new Date(d).toLocaleDateString('th-TH', { day:'numeric', month:'long', year:'numeric' });

onMounted(fetchData);
</script>

<style scoped>
.revenue-dashboard { padding: 2rem; background: transparent; min-height: 100vh; font-family: 'Inter', 'Kanit', sans-serif; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background: white; padding: 1.5rem; border-radius: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.icon-box { padding: 0.5rem; border-radius: 0.75rem; font-size: 1.25rem; }
.icon-box.blue { background: #eff6ff; }
.icon-box.green { background: #f0fdf4; }
.trend { font-size: 0.75rem; font-weight: 600; color: #10b981; }
.label { color: #64748b; font-size: 0.875rem; font-weight: 500; }
.value { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin: 0.25rem 0; }
.update { font-size: 0.75rem; color: #94a3b8; }

.content-card { background: white; border-radius: 1.25rem; padding: 1.5rem; border: 1px solid #f1f5f9; }
.card-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }

.tab-group { background: #f1f5f9; padding: 0.25rem; border-radius: 0.75rem; display: flex; gap: 0.25rem; }
.tab-btn { padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: #64748b; transition: 0.2s; }
.tab-btn.active { background: white; color: #1e293b; shadow: 0 1px 3px rgba(0,0,0,0.1); }

.filter-group { display: flex; gap: 0.75rem; }
.select-input, .date-input { padding: 0.5rem 0.75rem; border-radius: 0.6rem; border: 1px solid #e2e8f0; font-size: 0.875rem; outline: none; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 1rem; color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
.data-table td { padding: 1rem; border-bottom: 1px solid #f8fafc; font-size: 0.9rem; }
.bold { font-weight: 700; color: #1e293b; }
.text-right { text-align: right; }
.text-center { text-align: center; }
.time-tag { background: #f8fafc; padding: 0.25rem 0.5rem; border-radius: 0.4rem; color: #64748b; }
.cat-tag { background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 0.4rem; font-size: 0.75rem; }

.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; font-size: 0.875rem; color: #64748b; }
.page-nav { display: flex; gap: 0.5rem; }
.nav-btn { padding: 0.4rem 0.8rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; cursor: pointer; }
.nav-btn.active { background: #eff6ff; color: #3b82f6; border-color: #3b82f6; }
.view-btn { color: #3b82f6; background: transparent; border: none; font-weight: 600; cursor: pointer; }
</style>