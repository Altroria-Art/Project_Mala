<script setup>
import { ref } from 'vue'

const title = ref('ยินดีต้อนรับสู่ Foodie Express')
const count = ref(0)

const addOrder = () => {
  count.value++
}
</script>

<template>
  <div class="card">
    <h1>{{ title }}</h1>
    <p>เลือกสั่งอาหารที่คุณชอบได้ที่นี่</p>
    
    <div class="order-box">
      <p>จำนวนรายการในตะกร้า: <strong>{{ count }}</strong></p>
      <button @click="addOrder">เพิ่มอาหารใส่ตะกร้า</button>
      <button @click="count = 0" class="btn-reset">ล้างตะกร้า</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}
.btn-reset {
  background-color: #ff6b6b;
}
</style>