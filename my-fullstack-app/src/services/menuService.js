const mockMenus = [
  { id: 1, name: 'หมูสามชั้นสไลซ์/3 ชิ้น', price: 10, category: 'meat', image: '/images/pork-belly.png' },
  { id: 2, name: 'สันคอหมูสไลซ์/3 ชิ้น', price: 10, category: 'meat', image: '/images/pork-neck.png' },
  { id: 3, name: 'เส้นมันหนึบ', price: 20, category: 'other', image: '/images/noodle-1.png' },
  { id: 4, name: 'เส้นบุก', price: 20, category: 'other', image: '/images/noodle-2.png' },
  { id: 5, name: 'เต้าหู้ปลา/3 ชิ้น', price: 10, category: 'other', image: '/images/fish-tofu.png' },
];

export const menuService = {
  async getMenus() {

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