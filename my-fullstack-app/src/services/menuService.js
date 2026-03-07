// src/services/menuService.js

const mockMenus = [
  // หมวดเนื้อ (สมมติว่าหมูสไลซ์ทำได้ทั้งต้มและย่าง)
  { id: 1, name: 'หมูสามชั้นสไลซ์/3 ชิ้น', price: 10, category: 'meat', image: '/images/pork-belly.png', allowedCookTypes: ['boil', 'grill'] },
  { id: 2, name: 'สันคอหมูสไลซ์/3 ชิ้น', price: 10, category: 'meat', image: '/images/pork-neck.png', allowedCookTypes: ['boil', 'grill'] },
  
  // หมวดอื่นๆ และผัก (สมมติว่าเส้นกับผักกาดขาว เอาไว้ต้มอย่างเดียว)
  { id: 3, name: 'เส้นมันหนึบ', price: 20, category: 'other', image: '/images/noodle-1.png', allowedCookTypes: ['boil'] },
  { id: 4, name: 'ผักกาดขาว', price: 10, category: 'veg', image: '/images/veg-1.png', allowedCookTypes: ['boil'] },
  
  // หมวดเครื่องดื่มและของพร้อมทาน (ตั้งค่าเป็น ready อย่างเดียว)
  { id: 5, name: 'ข้าวสวย', price: 15, category: 'drink', image: 'https://via.placeholder.com/100?text=Rice', allowedCookTypes: ['ready'] },
  { id: 6, name: 'เป๊ปซี่ (ขวด)', price: 25, category: 'drink', image: 'https://via.placeholder.com/100?text=Pepsi', allowedCookTypes: ['ready'] },
  { id: 7, name: 'น้ำแข็ง (แก้ว)', price: 5, category: 'drink', image: 'https://via.placeholder.com/100?text=Ice', allowedCookTypes: ['ready'] }
];

export const menuService = {
  async getMenus() {
    // จำลองการโหลดข้อมูลจาก Database
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMenus);
      }, 500);
    });
  },

  async getMenusByCategory(category) {
    const allMenus = await this.getMenus();
    return allMenus.filter(menu => menu.category === category);
  }
};