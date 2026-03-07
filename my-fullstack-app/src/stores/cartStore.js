import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    bills: []
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
 
    orderCount: (state) => state.bills.length,
    grandTotalPrice: (state) => state.bills.reduce((total, bill) => total + bill.totalPrice, 0)
  },
  
  actions: {
    addToCart(product, addedAs) {
      const existingItem = this.items.find(item => item.id === product.id && item.typeAddedAs === addedAs);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1, typeAddedAs: addedAs });
      }
    },

    increaseQty(item) {
      const existingItem = this.items.find(i => i.id === item.id && i.typeAddedAs === item.typeAddedAs);
      if (existingItem) existingItem.quantity++;
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
    },

    async checkout(tableNumber, boilSoup, boilSpice, grillSpice) {
      if (this.items.length === 0) return;

      const orderedItems = JSON.parse(JSON.stringify(this.items));
      const billTotal = this.totalPrice;

      const hasBoil = orderedItems.some(i => i.typeAddedAs === 'boil');
      const hasGrill = orderedItems.some(i => i.typeAddedAs === 'grill');

      const newBill = {
        id: this.bills.length + 1, 
        items: orderedItems,
        totalPrice: billTotal,
        options: {
          boil: hasBoil ? `${boilSoup} [${boilSpice}]` : null,
          grill: hasGrill ? `[${grillSpice}]` : null
        },
        timestamp: new Date()
      };

      this.bills.push(newBill);
      this.items = [];
    }
  }
});