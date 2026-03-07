const API_URL = 'http://127.0.0.1:8787/api';

export const adminService = {
  async getProducts() {
  }, 


  async getQueue() {
    try {
      const response = await fetch(`${API_URL}/orders/queue`);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("🚨 ดึงข้อมูลคิวล้มเหลว:", error);
      return [];
    }
  }, 

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
  },

  async getTableBills() {
    try {
      const response = await fetch(`${API_URL}/orders/tables`);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("🚨 ดึงข้อมูลบิลรายโต๊ะล้มเหลว:", error);
      return [];
    }
  },
};