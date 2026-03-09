const API_URL = 'http://127.0.0.1:8787/api/products'; 

export const menuService = {
  async getMenus() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      
      const data = await response.json();

      const menuItems = Array.isArray(data) ? data : (data.results || []);

      return menuItems.map(item => {

        let cookType = item.cooking_type ? item.cooking_type.toLowerCase() : 'ready';
        if (cookType === 'boiled') cookType = 'boil';
        if (cookType === 'grilled') cookType = 'grill';

        let category = item.category || 'Others';

        // 🌟 แก้ไขตรงนี้: ให้ "ข้าวสวย" ไปอยู่ในหมวด 'Rice' เพื่อให้ตรงกับปุ่มในหน้าเว็บ
        if (item.name.includes('ข้าวสวย')) {
          category = 'Rice';
        }

        return {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image_url,
          category: category, 
          allowedCookTypes: [cookType] 
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