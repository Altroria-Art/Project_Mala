// 🌟 เปลี่ยนมา import แค่ตัว client (เช็ค path ให้ตรงกับตำแหน่งไฟล์ client.ts ของคุณนะครับ)
import { client } from '../client'; 

export const menuService = {
  async getMenus() {
    try {
      // 🌟 ใช้ client.api.products.$get() แทนการใช้ fetch()
      const response = await client.api.products.$get();
      
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      
      const data = await response.json();

      const menuItems = Array.isArray(data) ? data : (data.results || []);

      return menuItems.map(item => {
        let cookType = item.cooking_type ? item.cooking_type.toLowerCase() : 'ready';
        if (cookType === 'boiled') cookType = 'boil';
        if (cookType === 'grilled') cookType = 'grill';

        let category = item.category || 'อื่นๆ';

        return {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image_url,
          category: category, 
          allowedCookTypes: [cookType],
          stock: item.stock || 0  // 🌟 ดึงสต๊อกมาใช้ตามปกติ
        };
      });
    } catch (error) {
      console.error("🚨 ดึงข้อมูลล้มเหลว:", error);
      return [];
    }
  },

  async getMenusByCategory(category) {
    const allMenus = await this.getMenus();
    return allMenus.filter(menu => menu.category === category);
  }
};