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
          ปรุงอาหารเสร็จ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// ตรวจสอบ path ให้ตรงกับที่เก็บไฟล์ adminService.js ของคุณ
import { adminService } from '../../services/adminService'; 

const queueList = ref([]);

// ฟังก์ชันดึงข้อมูลจาก Backend (คงเดิมไว้)
const loadQueue = async () => {
  try {
    const rawData = await adminService.getQueue();
    // ถ้า rawData ไม่ใช่ Array ให้หยุดทำงานก่อนแอปพัง
    if (!Array.isArray(rawData)) {
      console.warn("Data is not an array:", rawData);
      return;
    }
    
    queueList.value = rawData.map(order => {
      const notes = [];
      if (order.soup_type) notes.push(`น้ำซุป: ${order.soup_type}`);
      if (order.spicy_boiled) notes.push(`[ต้ม] ${order.spicy_boiled}`);
      if (order.spicy_grilled) notes.push(`[ย่าง] ${order.spicy_grilled}`);

      let timeString = 'ไม่ระบุเวลา';
      if (order.created_at) {
        const utcString = order.created_at.replace(' ', 'T') + 'Z';
        timeString = new Date(utcString).toLocaleTimeString('th-TH', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Bangkok'
        });
      }

      return {
        id: order.id,
        tableNo: String(order.table_id || 0).padStart(2, '0'),
        billNo: order.order_number || 1,
        time: timeString,
        notes: notes,
        hasMore: false,
        // ป้องกัน Error ถ้า order.items เป็น null หรือ undefined
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
  // แถม: ตั้งเวลาให้รีเฟรชข้อมูลทุก 30 วินาทีอัตโนมัติ
  setInterval(loadQueue, 30000); 
});

// --- ส่วนที่แก้ไข: ทำให้ปุ่มทำงานได้จริง ---
const startCooking = async (id) => {
  if (confirm(`ยืนยันว่าปรุงออเดอร์หมายเลข ${id} เสร็จแล้ว?`)) {
    try {
      // 🌟 แก้ตรงนี้: เปลี่ยนคำว่า 'cooking' เป็น 'served'
      const result = await adminService.updateOrderStatus(id, 'served'); 
      
      if (result && result.success) {
        await loadQueue(); 
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }
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