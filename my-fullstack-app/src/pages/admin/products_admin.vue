<template>
  <div class="products-container">
    <section class="add-product-card shadow-sm">
      <h2 class="section-title">เพิ่มเมนู</h2>
      
      <div class="form-grid">
        <div class="upload-area">
          <label class="upload-btn">
            อัพโหลดรูป
            <input type="file" @change="onFileChange" accept="image/*" hidden />
          </label>
        </div>

        <input type="text" v-model="newProduct.name" placeholder="ชื่อเมนู" class="input-field" />
        <input type="number" v-model="newProduct.price" placeholder="ราคา" class="input-field" />
        <input type="number" v-model="newProduct.stock" placeholder="จำนวน" class="input-field" />
        
        <select v-model="newProduct.type" class="select-field">
          <option value="ต้ม">ต้ม</option>
          <option value="ย่าง">ย่าง</option>
        </select>
        
        <select v-model="newProduct.category" class="select-field">
          <option value="เนื้อสัตว์">เนื้อสัตว์</option>
          <option value="ผัก">ผัก</option>
          <option value="เครื่องดื่ม">เครื่องดื่ม</option>
        </select>
      </div>

      <div class="preview-section">
        <h3 class="preview-title">ตัวอย่างก่อนบันทึก</h3>
        <div class="preview-card">
          <div class="preview-img-box">
            <img v-if="previewImage" :src="previewImage" alt="Preview" />
            <span v-else>รูป</span>
          </div>
          <div class="preview-info">
            <p>ชื่อ: {{ newProduct.name || '-' }}</p>
            <p>ราคา: {{ newProduct.price || 0 }}</p>
            <p>จำนวน: {{ newProduct.stock || 0 }}</p>
            <p>หมวด : {{ newProduct.type }}</p>
            <p>หมวดหมู่ : {{ newProduct.category }}</p>
          </div>
        </div>
        <div class="action-row">
          <button @click="saveProduct" class="save-btn">บันทึก</button>
        </div>
      </div>
    </section>

    <section class="product-list-section">
      <h2 class="section-title">รายการเมนูในคลัง</h2>
      <div class="product-grid">
        <div v-for="item in products" :key="item.id" class="item-card">
          <div class="item-img">
             <img v-if="item.image" :src="item.image" alt="Product" />
             <div v-else class="no-img">ไม่มีรูป</div>
          </div>
          <div class="item-details">
            <h4 class="item-name">{{ item.name }}</h4>
            <div class="item-meta">
              <span>฿{{ item.price }}</span>
              <span>สต็อก: {{ item.stock }}</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="edit-btn">แก้ไข</button>
            <button class="delete-btn">ลบ</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// ข้อมูลสำหรับเพิ่มเมนูใหม่
const newProduct = ref({
  name: '',
  price: null,
  stock: null,
  type: 'ต้ม',
  category: 'เนื้อสัตว์'
});

const previewImage = ref(null);
const products = ref([
  { id: 1, name: 'เนื้อริบอาย', price: 89, stock: 50, type: 'ต้ม', category: 'เนื้อสัตว์', image: null },
  { id: 2, name: 'ผักบุ้ง', price: 20, stock: 100, type: 'ต้ม', category: 'ผัก', image: null }
]);

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};

const saveProduct = () => {
  if (!newProduct.value.name) return alert('กรุณาใส่ชื่อเมนู');
  // Logic สำหรับบันทึกลงฐานข้อมูล
  console.log('บันทึกเมนู:', newProduct.value);
  alert('บันทึกสำเร็จ!');
};
</script>

<style scoped>
.products-container {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 50px;
}

.section-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

/* Add Product Card */
.add-product-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.upload-btn {
  background: #f3f4f6;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #ddd;
}

.input-field, .select-field {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  flex: 1;
  min-width: 120px;
}

/* Preview Section */
.preview-section {
  border-top: 1px dashed #ddd;
  padding-top: 20px;
}

.preview-title { font-size: 24px; margin-bottom: 15px; }

.preview-card {
  display: flex;
  gap: 20px;
  background: #fff;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 15px;
  max-width: 600px;
}

.preview-img-box {
  width: 180px;
  height: 150px;
  background: #d9d9d9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  overflow: hidden;
}

.preview-img-box img { width: 100%; height: 100%; object-fit: cover; }

.preview-info p { margin: 5px 0; font-size: 14px; color: #555; }

.action-row { display: flex; justify-content: flex-end; margin-top: 20px; }

.save-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

/* Product List Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.item-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.item-img { height: 140px; background: #f3f4f6; position: relative; }
.no-img { display: flex; align-items: center; justify-content: center; height: 100%; color: #999; }

.item-details { padding: 15px; flex-grow: 1; }
.item-name { margin: 0 0 10px 0; font-size: 16px; }
.item-meta { display: flex; justify-content: space-between; font-size: 14px; color: #f97316; font-weight: bold; }

.item-actions {
  display: flex;
  padding: 10px;
  gap: 10px;
  background: #fafafa;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  cursor: pointer;
}

.edit-btn { background: #4b5563; color: white; }
.delete-btn { background: #fee2e2; color: #ef4444; }
</style>