const API_URL = 'http://127.0.0.1:8787/api';

export const adminService = {
  // ฟังก์ชันแรก
  async getProducts() {
    // ... โค้ดเดิมของคุณ ...
  }, // <--- ต้องมี Comma (,) ตรงนี้สำคัญมาก!

  // ฟังก์ชันที่สอง (คิวห้องครัว)
  async getQueue() {
    try {
      const response = await fetch(`${API_URL}/orders/queue`);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("🚨 ดึงข้อมูลคิวล้มเหลว:", error);
      return [];
    }
  }, // <--- ต้องมี Comma (,) ตรงนี้ด้วยถ้าจะมีฟังก์ชันต่อท้าย

  // ฟังก์ชันอัปเดตสถานะ
  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      return await response.json();
    } catch (error) {
      console.error("🚨 อัปเดตสถานะล้มเหลว:", error);
    }
  }
};