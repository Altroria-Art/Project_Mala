<template>
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
          <li v-for="(item, index) in order.items" :key="index" class="item-row">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">x {{ item.qty }}</span>
          </li>
          <li class="more-indicator" v-if="order.hasMore">. . .</li>
        </ul>

        <div class="note-container" v-if="order.notes && order.notes.length > 0">
          <p v-for="(note, nIndex) in order.notes" :key="nIndex">
            📌 {{ note }}
          </p>
        </div>

        <button class="cook-action-btn" @click="startCooking(order.id)">
          เริ่มปรุงอาหาร
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// ข้อมูลจำลองสำหรับหน้าคิว (อิงตามโครงสร้างที่คุณเคยใช้)
const queueList = ref([
  {
    id: 1,
    tableNo: '01',
    billNo: '1',
    time: '10:12:00',
    items: [
      { name: 'หมูสามชั้นสไลด์/3 ชิ้น [ต้ม]', qty: 5 },
      { name: 'ผ้าขี้ริ้ววัว/3ชิ้น [ต้ม]', qty: 5 },
      { name: 'เต้าหู้ไข่/3 ชิ้น [ต้ม]', qty: 5 },
      { name: 'ไส้วัว [ต้ม]', qty: 5 }
    ],
    hasMore: false,
    notes: ['[ต้ม] เผ็ดกลาง']
  },
  {
    id: 2,
    tableNo: '02',
    billNo: '1',
    time: '10:13:00',
    items: [
      { name: 'สามชั้นพันเห็ดเข็มทอง [ย่าง]', qty: 5 },
      { name: 'ไส้กรอก [ย่าง]', qty: 5 }
    ],
    hasMore: true,
    notes: ['[ย่าง] เผ็ดกลาง']
  }
]);

const startCooking = (id) => {
  console.log(`กำลังเริ่มปรุงออเดอร์ ID: ${id}`);
  // เพิ่ม Logic สำหรับจัดการสถานะออเดอร์ตรงนี้
};
</script>

<style scoped>
/* จัดวาง Grid ให้ยืดหยุ่น */
.queue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  width: 100%;
}

/* ดีไซน์การ์ดออเดอร์ */
.order-card {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  display: flex;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.card-side-accent {
  width: 8px;
  background: linear-gradient(to bottom, #ffc0cb, #ff8a8a); /* ไล่เฉดสีชมพู */
}

.card-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.badges-group {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: white;
}

.table-id { background-color: #312e81; }
.bill-no { background-color: #ef4444; }

.order-time {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* รายการอาหาร */
.order-items-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  flex: 1;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #f3f4f6;
  font-size: 15px;
  color: #374151;
}

.item-qty {
  font-weight: 700;
  color: #111827;
}

.more-indicator {
  text-align: center;
  color: #9ca3af;
  margin-top: 10px;
}

/* กล่องหมายเหตุ */
.note-container {
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 20px;
  border-left: 4px solid #d1d5db;
}

/* ปุ่มกด */
.cook-action-btn {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.cook-action-btn:hover {
  filter: brightness(1.1);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
}

.cook-action-btn:active {
  transform: scale(0.98);
}
</style>