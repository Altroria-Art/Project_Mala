import { client } from '../client';

export const adminService = {
  async getProducts() {
  }, 

  async getQueue() {
    try {
      const response = await client.api.orders.queue.$get();
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("🚨 ดึงข้อมูลคิวล้มเหลว:", error);
      return [];
    }
  }, 

  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await client.api.orders[':id'].status.$patch({
        param: { id: orderId.toString() },
        json: { status: newStatus }
      });
      return await response.json();
    } catch (error) {
      console.error("🚨 อัปเดตสถานะล้มเหลว:", error);
    }
  },

  async getTableBills() {
    try {
      const response = await client.api.orders.tables.$get();
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("🚨 ดึงข้อมูลบิลรายโต๊ะล้มเหลว:", error);
      return [];
    }
  },
};