import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items')) || [],
    bills: []
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    orderCount: (state) => state.bills.length,
    grandTotalPrice: (state) => state.bills.reduce((total, bill) => total + bill.totalPrice, 0)
  },
  
  actions: {
    saveCart() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    },

    addToCart(product, addedAs) {
      const existingItem = this.items.find(item => item.id === product.id && item.typeAddedAs === addedAs);
      
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        } else {
          alert(`สินค้า "${product.name}" มีจำนวนสูงสุดแค่ ${product.stock} ชิ้นเท่านั้นครับ`);
          return; 
        }
      } else {
        if (product.stock > 0) {
          this.items.push({ ...product, quantity: 1, typeAddedAs: addedAs });
        } else {
          alert(`ขออภัยครับ สินค้า "${product.name}" หมดแล้วครับ`);
          return;
        }
      }
      this.saveCart();
    },

    increaseQty(item) {
      const existingItem = this.items.find(i => i.id === item.id && i.typeAddedAs === item.typeAddedAs);
      if (existingItem) {
        if (existingItem.quantity < item.stock) {
          existingItem.quantity++;
        } else {
          alert(`ไม่สามารถเพิ่มจำนวนได้ เนื่องจากสต๊อกมีจำกัดเพียง ${item.stock} ชิ้นครับ`);
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
      if (this.items.length === 0) return { success: false, message: 'ไม่มีสินค้าในตะกร้า' };

      const orderedItems = JSON.parse(JSON.stringify(this.items));
      const billTotal = this.totalPrice;

      const hasBoil = orderedItems.some(i => i.typeAddedAs === 'boil');
      const hasGrill = orderedItems.some(i => i.typeAddedAs === 'grill');

      const payload = {
        table_id: parseInt(tableNumber) || 1, // บันทึกบิลเป็นโต๊ะ 1 ตามที่คุณต้องการ
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

        const data = await response.json();

        if (!response.ok || !data.success) {
          return { success: false, message: data.message || 'เกิดข้อผิดพลาดในการสั่งอาหาร' };
        }
        
        localStorage.setItem('my_table_id', tableNumber);
        this.items = [];
        this.saveCart();
        await this.syncBills();

        return { success: true, message: 'ส่งออเดอร์ไปที่ครัวเรียบร้อยแล้วครับ!' };

      } catch (error) {
        console.error('Checkout failed:', error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการส่งออเดอร์ กรุณาลองใหม่อีกครั้ง' };
      }
    },

    async syncBills() {
      const tableId = localStorage.getItem('my_table_id');
      if (!tableId) return;

      try {
        const response = await fetch(`http://localhost:8787/api/orders/table/${tableId}`);
        if (!response.ok) return;
        
        const activeOrders = await response.json();

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