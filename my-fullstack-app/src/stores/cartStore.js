// src/stores/cartStore.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // เก็บรายการอาหารที่เลือก
  }),
  
  getters: {
    // นับจำนวนชิ้นทั้งหมดในตะกร้า (สำหรับโชว์ตรงไอคอนตะกร้าสีแดง)
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    // คำนวณราคารวมทั้งหมด
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
  },
  
  actions: {
    addToCart(product) {
      // เช็คว่ามีสินค้านี้ในตะกร้าหรือยัง
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1; // ถ้ามีแล้วให้เพิ่มจำนวน
      } else {
        this.items.push({ ...product, quantity: 1 }); // ถ้ายังไม่มีให้เพิ่มเข้าไปใหม่
      }
    },
    
    // อนาคตสามารถเพิ่ม action สำหรับยืนยันคำสั่งซื้อ (ยิง API POST ไปที่ Backend) ตรงนี้ได้เลย
    async checkout(tableNumber) {
      // const response = await axios.post('/api/orders', { table: tableNumber, items: this.items });
      console.log('ส่งออเดอร์ไปครัวโต๊ะ:', tableNumber, 'รายการ:', this.items);
      this.items = []; // สั่งเสร็จเคลียร์ตะกร้า
    }
  }
});