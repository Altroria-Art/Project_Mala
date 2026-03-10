<template>
  <div>
    <div class="header-section">
      <div class="header-title">
        <span class="title-icon">📊</span>
        <h1>สรุปรายได้ </h1>
      </div>
      
      <div class="today-badge">
        <span class="icon">📅</span> วันนี้: {{ formatDateTh(todayDate) }}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box blue">📈</div>
        </div>
        <span class="label">ยอดขายวันนี้</span>
        <h2 class="value text-blue">฿{{ summary.daily_amount.toLocaleString() }}</h2>
        <p class="update">อัปเดตล่าสุดเมื่อ 1 นาทีที่แล้ว</p>
      </div>

      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box green">📄</div>
        </div>
        <span class="label">จำนวนบิลวันนี้</span>
        <h2 class="value text-green">{{ summary.daily_count }} <span class="unit">บิล</span></h2>
        <p class="update">จำนวนบิลทั้งหมดที่ชำระแล้ว</p>
      </div>

      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box purple">💰</div>
        </div>
        <span class="label">ยอดขายเดือนนี้</span>
        <h2 class="value text-purple">฿{{ summary.monthly_amount.toLocaleString() }}</h2>
        <p class="update">ยอดรวมของเดือนปัจจุบัน</p>
      </div>

      <div class="stat-card">
        <div class="card-header">
          <div class="icon-box orange">📊</div>
        </div>
        <span class="label">ยอดขายเฉลี่ยต่อวัน</span>
        <h2 class="value text-orange">฿{{ Math.round(summary.avg_per_day).toLocaleString() }}</h2>
        <p class="update">คำนวณจากยอดเดือนนี้</p>
      </div>
    </div>

    <div class="content-card shadow-sm">
      <div class="card-controls">
        <div class="tab-group">
          <button 
            @click="changeTab('daily')" 
            :class="['tab-btn', { active: viewMode === 'daily' }]"
          >🧾 ประวัติบิลรายวัน</button>
          <button 
            @click="changeTab('items')" 
            :class="['tab-btn', { active: viewMode === 'items' }]"
          >🥩 สถิติวัตถุดิบรายวัน</button>
          <button 
            @click="changeTab('monthly')" 
            :class="['tab-btn', { active: viewMode === 'monthly' }]"
          >📅 สรุปรายวัน (เดือนนี้)</button>
        </div>

        <div class="filter-group">
          <select v-if="viewMode === 'daily'" v-model="selectedTable" @change="resetPage" class="select-input">
            <option value="all">ดูทุกโต๊ะ</option>
            <option v-for="n in 5" :key="n" :value="n">โต๊ะ {{ n }}</option>
          </select>

          <select v-if="viewMode === 'items'" v-model="selectedCategory" @change="resetPage" class="select-input">
            <option value="all">ดูทุกหมวดหมู่</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <div class="table-responsive" v-if="viewMode === 'daily'">
          <table class="data-table">
            <colgroup>
              <col style="width: 20%;" /> 
              <col style="width: 30%;" /> 
              <col style="width: 25%;" /> 
              <col style="width: 25%;" /> 
            </colgroup>
            <thead>
              <tr>
                <th>เวลา</th>
                <th>เลขที่บิล</th>
                <th>โต๊ะ</th>
                <th class="text-right">ยอดเงิน (฿)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bill in paginatedHistory" :key="bill.id">
                <td><span class="time-tag">🕒 {{ formatTime(bill.created_at) }}</span></td>
                <td class="bold text-gray-800">{{ String(bill.id).padStart(4, '0') }}</td>
                <td><span class="table-tag">โต๊ะ {{ bill.table_id }}</span></td>
                <td class="text-right bold text-green">฿{{ (bill.total_price || 0).toLocaleString() }}</td>
              </tr>
              <tr v-if="paginatedHistory.length === 0">
                <td colspan="4" class="empty-state">ไม่พบข้อมูลบิลในวันที่เลือก</td>
              </tr>
              <tr v-for="n in Math.max(0, itemsPerPage - paginatedHistory.length)" :key="'empty-daily-'+n" class="empty-row">
                <td colspan="4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-responsive" v-if="viewMode === 'items'">
          <table class="data-table">
            <colgroup>
              <col style="width: 10%;" /> 
              <col style="width: 35%;" /> 
              <col style="width: 20%;" /> 
              <col style="width: 15%;" /> 
              <col style="width: 20%;" /> 
            </colgroup>
            <thead>
              <tr>
                <th class="text-center">อันดับ</th>
                <th>ชื่อวัตถุดิบ</th>
                <th>หมวดหมู่</th>
                <th class="text-center">จำนวนที่ขายได้</th>
                <th class="text-right">ยอดเงินรวม (฿)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedItemsStats" :key="index">
                <td class="text-center"><span class="rank-badge">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span></td>
                <td class="bold">{{ item.name }}</td>
                <td><span class="cat-tag">{{ item.category }}</span></td>
                <td class="text-center font-medium">{{ item.quantity || 0 }}</td>
                <td class="text-right bold">฿{{ (item.total || 0).toLocaleString() }}</td>
              </tr>
              <tr v-if="paginatedItemsStats.length === 0">
                <td colspan="5" class="empty-state">ไม่พบข้อมูลสถิติวัตถุดิบ</td>
              </tr>
              <tr v-for="n in Math.max(0, itemsPerPage - paginatedItemsStats.length)" :key="'empty-items-'+n" class="empty-row">
                <td colspan="5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-responsive" v-if="viewMode === 'monthly'">
          <table class="data-table">
            <colgroup>
              <col style="width: 40%;" /> 
              <col style="width: 30%;" /> 
              <col style="width: 30%;" /> 
            </colgroup>
            <thead>
              <tr>
                <th>วันที่</th>
                <th class="text-center">จำนวนบิล</th>
                <th class="text-right">ยอดขายรวม (฿)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stat, index) in paginatedMonthlyStats" :key="index">
                <td class="bold text-gray-800">📅 {{ formatDateTh(stat.date) }}</td>
                <td class="text-center font-medium">{{ stat.bill_count }}</td>
                <td class="text-right bold text-green">฿{{ (stat.total_sales || 0).toLocaleString() }}</td>
              </tr>
              <tr v-if="paginatedMonthlyStats.length === 0">
                <td colspan="3" class="empty-state">ไม่พบข้อมูลยอดขายในเดือนนี้</td>
              </tr>
              <tr v-for="n in Math.max(0, itemsPerPage - paginatedMonthlyStats.length)" :key="'empty-monthly-'+n" class="empty-row">
                <td colspan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-footer">
        <div class="page-nav">
          <button class="nav-btn" :disabled="currentPage === 1" @click="prevPage">« ก่อนหน้า</button>
          <button v-for="page in totalPages" :key="page" :class="['nav-btn', { active: currentPage === page }]" @click="goToPage(page)">{{ page }}</button>
          <button class="nav-btn" :disabled="currentPage === totalPages || totalPages === 0" @click="nextPage">ถัดไป »</button>
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
const monthlyStats = ref([]); 
const selectedTable = ref('all');
const selectedCategory = ref('all');

const currentPage = ref(1);
const itemsPerPage = 10;

const getLocalISODate = () => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; 
  return (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
};

const filterDate = ref(getLocalISODate());
const todayDate = ref(getLocalISODate()); 

const fetchData = async () => {
  try {
    const sumRes = await fetch('http://127.0.0.1:8787/api/revenue/summary');
    summary.value = await sumRes.json();
    
    const histRes = await fetch(`http://127.0.0.1:8787/api/revenue/history?date=${filterDate.value}`);
    const histData = await histRes.json();
    history.value = Array.isArray(histData) ? histData : [];
    
    const itemsRes = await fetch(`http://127.0.0.1:8787/api/revenue/items?date=${filterDate.value}`);
    const itemsData = await itemsRes.json();
    itemsStats.value = Array.isArray(itemsData) ? itemsData : [];

    const monthlyRes = await fetch(`http://127.0.0.1:8787/api/revenue/monthly?date=${filterDate.value}`);
    const monthlyData = await monthlyRes.json();
    monthlyStats.value = Array.isArray(monthlyData) ? monthlyData : [];

    resetPage();
  } catch (e) {
    console.error("API Error:", e);
  }
};

const filteredHistory = computed(() => {
  if (selectedTable.value === 'all') return history.value;
  return history.value.filter(b => b.table_id == selectedTable.value);
});

const filteredItemsStats = computed(() => {
  if (selectedCategory.value === 'all') return itemsStats.value;
  return itemsStats.value.filter(item => item.category === selectedCategory.value);
});

const currentDataArray = computed(() => {
  if (viewMode.value === 'daily') return filteredHistory.value;
  if (viewMode.value === 'items') return filteredItemsStats.value;
  if (viewMode.value === 'monthly') return monthlyStats.value;
  return [];
});

const totalItems = computed(() => currentDataArray.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalItems.value));

const paginatedHistory = computed(() => filteredHistory.value.slice(startIndex.value, endIndex.value));
const paginatedItemsStats = computed(() => filteredItemsStats.value.slice(startIndex.value, endIndex.value));
const paginatedMonthlyStats = computed(() => monthlyStats.value.slice(startIndex.value, endIndex.value));

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const goToPage = (page) => { currentPage.value = page; };
const resetPage = () => { currentPage.value = 1; };

const changeTab = (tab) => {
  viewMode.value = tab;
  resetPage();
};

watch(filterDate, fetchData);

const formatTime = (s) => {
  if (!s) return '-';
  const utcString = s.replace(' ', 'T') + 'Z';
  return new Date(utcString).toLocaleTimeString('th-TH', { 
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok'
  });
};

const formatDateTh = (d) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('th-TH', { 
    day:'numeric', month:'short', year:'numeric', timeZone: 'Asia/Bangkok'
  });
};

const categories = ref([]);

const fetchCategories = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8787/api/categories');
    const data = await res.json();
    if (Array.isArray(data)) {
      categories.value = data;
    }
  } catch (e) {
    console.error("API Fetch Categories Error:", e);
  }
};

onMounted(() => {
  fetchData();
  fetchCategories();
});
</script>

<style scoped>
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.header-title { display: flex; align-items: center; gap: 12px; }
.header-title h1 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 0; }
.title-icon { font-size: 2rem; }

.today-badge { 
  background: #f0fdf4; 
  padding: 0.6rem 1.2rem; 
  border-radius: 50px; 
  font-weight: 600; 
  color: #166534; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
  border: 1px solid #bbf7d0; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
}

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background: white; padding: 1.5rem; border-radius: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.icon-box { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.25rem; }
.icon-box.blue { background: #eff6ff; color: #3b82f6; }
.icon-box.green { background: #f0fdf4; color: #10b981; }
.icon-box.purple { background: #faf5ff; color: #a855f7; }
.icon-box.orange { background: #fff7ed; color: #f97316; }

.label { color: #64748b; font-size: 0.9rem; font-weight: 500; display: block; }
.value { font-size: 2rem; font-weight: 800; margin: 0.25rem 0; letter-spacing: -0.5px;}
.unit { font-size: 1rem; color: #94a3b8; font-weight: 500; }
.update { font-size: 0.8rem; color: #94a3b8; margin: 0; }

.content-card { background: white; border-radius: 1.25rem; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
.card-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }

.tab-group { background: #f1f5f9; padding: 0.35rem; border-radius: 1rem; display: flex; gap: 0.25rem; }
.tab-btn { padding: 0.6rem 1.2rem; border-radius: 0.75rem; border: none; background: transparent; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: #64748b; transition: all 0.2s; }
.tab-btn:hover { color: #1e293b; }
.tab-btn.active { background: white; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

.filter-group { display: flex; gap: 0.75rem; align-items: center; }

.select-input { padding: 0.6rem 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none; background: #fff; color: #334155; transition: border-color 0.2s; }
.select-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

.table-container { min-height: 650px; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; }
.data-table th { text-align: left; padding: 1.2rem 1rem; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
.data-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; vertical-align: middle; transition: background-color 0.2s; height: 61px; }

.empty-row td { border-bottom: 1px solid transparent; }
.data-table tbody tr:hover:not(.empty-row) td { background-color: #f8fafc; }

.bold { font-weight: 700; }
.font-medium { font-weight: 500; }

th.text-right, td.text-right, .text-right { 
  text-align: right !important; 
  padding-right: 2.5rem !important; 
}
th.text-center, td.text-center, .text-center { 
  text-align: center !important; 
}

.text-blue { color: #2563eb; }
.text-green { color: #059669; }
.text-purple { color: #7e22ce; }
.text-orange { color: #ea580c; }
.text-gray-800 { color: #1e293b; }

.time-tag { background: #f1f5f9; padding: 0.3rem 0.6rem; border-radius: 6px; color: #475569; font-size: 0.85rem;}
.table-tag { background: #e0e7ff; color: #3730a3; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem;}
.cat-tag { background: #fef3c7; color: #b45309; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;}
.rank-badge { background: #cbd5e1; color: white; width: 24px; height: 24px; display: inline-flex; justify-content: center; align-items: center; border-radius: 50%; font-weight: bold; font-size: 0.8rem;}

.empty-state { text-align: center; color: #94a3b8; padding: 3rem !important; }

.card-footer { display: flex; justify-content: flex-end; align-items: center; margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; }
.page-nav { display: flex; gap: 0.4rem; }
.nav-btn { padding: 0.5rem 0.8rem; min-width: 40px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: all 0.2s; display: flex; justify-content: center; align-items: center;}
.nav-btn:hover:not(:disabled) { border-color: #cbd5e1; background: #f8fafc; }
.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #f1f5f9; }
.nav-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
</style>