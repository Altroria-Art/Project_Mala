import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // โหลดของที่อยู่ในตะกร้าจาก LocalStorage (ถ้ามี) กันรีเฟรชแล้วตะกร้าหาย
    items: JSON.parse(localStorage.getItem('cart_items')) || [],
    bills: [] // ประวัติการสั่ง จะดึงจาก Database แทน
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
 
    orderCount: (state) => state.bills.length,
    grandTotalPrice: (state) => state.bills.reduce((total, bill) => total + bill.totalPrice, 0)
  },
  
  actions: {
    // ฟังก์ชันช่วยเซฟตะกร้าลงเครื่อง
    saveCart() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    },

    addToCart(product, addedAs) {
      const existingItem = this.items.find(item => item.id === product.id && item.typeAddedAs === addedAs);
      
      // 🌟 ดักจับสต๊อก: ถ้ามีของในตะกร้าอยู่แล้ว แล้วกดเพิ่มอีก ห้ามเกินสต๊อก
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        } else {
          // แจ้งเตือนลูกค้าว่าของหมดโควต้าแล้ว
          alert(`สินค้า "${product.name}" มีจำนวนสูงสุดแค่ ${product.stock} ที่เท่านั้นครับ`);
          return; // เด้งออกไปเลย ไม่เพิ่มจำนวนให้
        }
      } else {
        // 🌟 ดักจับสต๊อก: ตอนกดครั้งแรก ต้องเช็คว่าสต๊อก > 0 ไหม
        if (product.stock > 0) {
          this.items.push({ ...product, quantity: 1, typeAddedAs: addedAs });
        } else {
          alert(`ขออภัยครับ สินค้า "${product.name}" หมดแล้วครับ`);
          return;
        }
      }
      this.saveCart();
    },

    // ฟังก์ชันเวลากดเครื่องหมาย + ในหน้าตะกร้า (CartModal)
    // 🌟 ต้องส่งข้อมูล 'สต๊อกที่อัปเดตแล้ว' มาให้ด้วย เพื่อให้เช็คได้แม่นยำขึ้น
    // หมายเหตุ: ค่า item ที่รับมาในตะกร้า มักจะมี item.stock ติดมาด้วยจากตอน addToCart
    increaseQty(item) {
      const existingItem = this.items.find(i => i.id === item.id && i.typeAddedAs === item.typeAddedAs);
      
      if (existingItem) {
        // 🌟 ดักจับสต๊อก
        if (existingItem.quantity < item.stock) {
          existingItem.quantity++;
        } else {
          alert(`ไม่สามารถเพิ่มจำนวนได้ เนื่องจากสต๊อกมีจำกัดเพียง ${item.stock} ที่ครับ`);
          return;
        }
      }
      this.saveCart();
    },

    decreaseQty(item) {
      const existingItem = this.items.find(i => i.id === item.id && i.typeAddedAs === item.typeAddedAs);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity--;
        } else {
          const index = this.items.indexOf(existingItem);
          if (index > -1) this.items.splice(index, 1);
        }
      }
      this.saveCart();
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    async checkout(tableNumber, boilSoup, boilSpice, grillSpice) {
      if (this.items.length === 0) return;

      const orderedItems = JSON.parse(JSON.stringify(this.items));
      const billTotal = this.totalPrice;

      const hasBoil = orderedItems.some(i => i.typeAddedAs === 'boil');
      const hasGrill = orderedItems.some(i => i.typeAddedAs === 'grill');

      const payload = {
        table_id: parseInt(tableNumber) || 1,
        items: orderedItems,
        total_price: billTotal,
        soup_type: hasBoil ? boilSoup : null,
        spicy_boiled: hasBoil ? `ระดับ ${boilSpice}` : null,
        spicy_grilled: hasGrill ? `ระดับ ${grillSpice}` : null
      };

      try {
        const response = await fetch('http://localhost:8787/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        // สั่งสำเร็จ! จำเบอร์โต๊ะไว้ในเครื่องลูกค้า
        localStorage.setItem('my_table_id', tableNumber);

        // ล้างตะกร้า
        this.items = [];
        this.saveCart();

        // ไปดูดข้อมูลบิลจาก Database มาโชว์
        await this.syncBills();

        // แจ้งว่าออเดอร์ถูกส่งแล้ว (ถ้าอยากให้มี Alert บอก)
        // alert('ส่งออเดอร์เรียบร้อยแล้วครับ!');

      } catch (error) {
        console.error('Checkout failed:', error);
        alert('เกิดข้อผิดพลาดในการส่งออเดอร์ กรุณาลองใหม่อีกครั้ง');
      }
    },

    // 🌟 ดึงข้อมูลบิลของโต๊ะตัวเองจาก Database
    async syncBills() {
      // เช็คก่อนว่าเครื่องนี้เคยสั่งอาหารโต๊ะไหนไป
      const tableId = localStorage.getItem('my_table_id');
      if (!tableId) return;

      try {
        const response = await fetch(`http://localhost:8787/api/orders/table/${tableId}`);
        if (!response.ok) return;
        
        const activeOrders = await response.json();

        // แปลงข้อมูลจาก DB ให้ตรงกับที่ Vue นำไปแสดงผล
        this.bills = activeOrders.map(order => ({
          id: order.id,
          items: order.items.map(i => ({
            id: i.id,
            name: i.product_name,
            quantity: i.quantity,
            price: i.subtotal_price / i.quantity,
            typeAddedAs: i.cooking_type
          })),
          totalPrice: order.total_price,
          options: {
            boil: order.soup_type ? `${order.soup_type} [${order.spicy_boiled}]` : null,
            grill: order.spicy_grilled ? `[${order.spicy_grilled}]` : null
          },
          timestamp: order.created_at,
          status: order.status
        }));
      } catch (error) {
        console.error('Failed to sync bills:', error);
      }
    }
  }
});