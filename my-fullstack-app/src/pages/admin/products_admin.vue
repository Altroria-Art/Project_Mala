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
        
        <select v-model="newProduct.cooking_type" class="select-field">
          <option value="boiled">ต้ม</option>
          <option value="grilled">ย่าง</option>
          <option value="ready">พร้อมทาน</option>
        </select>
        
        <select v-model="newProduct.category" class="select-field">
          <option value="เนื้อสัตว์">เนื้อสัตว์</option>
          <option value="ผัก">ผัก</option>
          <option value="ของทานเล่น">ของทานเล่น</option>
          <option value="เส้น">เส้น</option>
          <option value="ข้าว">ข้าว</option>
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
            <p>ประเภท: {{ newProduct.cooking_type === 'boiled' ? 'ต้ม' : (newProduct.cooking_type === 'grilled' ? 'ย่าง' : 'พร้อมทาน') }}</p>
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
            <img v-if="item.image_url" :src="item.image_url" alt="Product" />
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
            <button class="edit-btn" @click="openEditModal(item)">แก้ไข</button>
            <button class="delete-btn" @click="confirmDelete(item.id)">ลบ</button>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade">
      <div v-if="editingProduct" class="modal-overlay" @click.self="editingProduct = null">
        <div class="modal-content">
          <h2>แก้ไขเมนู</h2>
          <div class="form-grid">
            
            <div style="width: 100%; display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
              <img v-if="editingProduct.image_url" :src="editingProduct.image_url" alt="Current Image" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" />
              <label class="upload-btn" style="flex-grow: 1; text-align: center; margin: 0;">
                เปลี่ยนรูปภาพ
                <input type="file" @change="onEditFileChange" accept="image/*" hidden />
              </label>
            </div>

            <input type="text" v-model="editingProduct.name" placeholder="ชื่อเมนู" class="input-field" />
            <input type="number" v-model="editingProduct.price" placeholder="ราคา" class="input-field" />
            <input type="number" v-model="editingProduct.stock" placeholder="จำนวน" class="input-field" />
            
            <select v-model="editingProduct.cooking_type" class="select-field">
              <option value="boiled">ต้ม</option>
              <option value="grilled">ย่าง</option>
              <option value="ready">พร้อมทาน</option>
            </select>
            
            <select v-model="editingProduct.category" class="select-field">
              <option value="เนื้อสัตว์">เนื้อสัตว์</option>
              <option value="ผัก">ผัก</option>
              <option value="ของทานเล่น">ของทานเล่น</option>
              <option value="เส้น">เส้น</option>
              <option value="ข้าว">ข้าว</option>
              <option value="เครื่องดื่ม">เครื่องดื่ม</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click="editingProduct = null">ยกเลิก</button>
            <button class="save-btn" @click="saveEditProduct">บันทึก</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal-overlay" v-if="isSuccessModalOpen" @click.self="closeSuccessModal">
        <div class="modal-content success-modal">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>สำเร็จ!</h2>
          <p>{{ successMessage }}</p>
          <button class="success-ok-btn" @click="closeSuccessModal">ตกลง</button>
        </div>
      </div>
    </transition>

  </div> 
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../../client'; // 🌟 เปลี่ยนมาใช้ client แทน API_URL

const newProduct = ref({
  name: '',
  price: null,
  stock: null,
  cooking_type: 'boiled', 
  category: 'เนื้อสัตว์'
});

const previewImage = ref(null);
const selectedFile = ref(null);
const products = ref([]);
const editingProduct = ref(null); 
const editSelectedFile = ref(null);

const isSuccessModalOpen = ref(false);
const successMessage = ref('');

const showSuccessModal = (message) => {
  successMessage.value = message;
  isSuccessModalOpen.value = true;
};

const closeSuccessModal = () => {
  isSuccessModalOpen.value = false;
};

const resetForm = () => {
  newProduct.value = {
    name: '',
    price: null,
    stock: null,
    cooking_type: 'boiled', 
    category: 'เนื้อสัตว์'
  };
  previewImage.value = null;
  selectedFile.value = null;
};

const fetchProducts = async () => {
  try {
    const response = await client.api.products.$get();
    if (!response.ok) throw new Error('Failed to fetch products');
    products.value = await response.json(); 
  } catch (error) {
    console.error("🚨 ดึงข้อมูลเมนูล้มเหลว:", error);
  }
};

onMounted(() => fetchProducts());

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewImage.value = URL.createObjectURL(file); 
  }
};

const saveProduct = async () => {
  if (!newProduct.value.name) return alert('กรุณาใส่ชื่อเมนู');
  if (!newProduct.value.price) return alert('กรุณาใส่ราคา');

  const formData = {
    name: newProduct.value.name,
    price: String(newProduct.value.price),
    stock: String(newProduct.value.stock || 0),
    cooking_type: newProduct.value.cooking_type,
    category: newProduct.value.category,
  };
  if (selectedFile.value) formData.image = selectedFile.value;

  try {
    const response = await client.api.products.$post({ form: formData });

    if (!response.ok) throw new Error('Failed to save product');

    resetForm();
    fetchProducts();
    showSuccessModal('บันทึกเมนูสำเร็จ!');
    
  } catch (error) {
    console.error("🚨 บันทึกล้มเหลว:", error);
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
};

const openEditModal = (item) => {
  editingProduct.value = { ...item };
  editSelectedFile.value = null; 
};

const onEditFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    editSelectedFile.value = file;
    editingProduct.value.image_url = URL.createObjectURL(file); 
  }
};

const saveEditProduct = async () => {
  if (!editingProduct.value.name) return alert('กรุณาใส่ชื่อเมนู');

  const formData = {
    name: editingProduct.value.name,
    price: String(editingProduct.value.price),
    stock: String(editingProduct.value.stock || 0),
    cooking_type: editingProduct.value.cooking_type,
    category: editingProduct.value.category,
  };
  if (editSelectedFile.value) formData.image = editSelectedFile.value;

  try {
    const response = await client.api.products[':id'].$patch({
      param: { id: editingProduct.value.id.toString() },
      form: formData 
    });

    if (!response.ok) throw new Error('Failed to update product');

    editingProduct.value = null;
    fetchProducts();
    showSuccessModal('บันทึกการแก้ไขสำเร็จ!');

  } catch (error) {
    console.error("🚨 แก้ไขข้อมูลล้มเหลว:", error);
    alert('เกิดข้อผิดพลาดในการแก้ไข');
  }
};

const confirmDelete = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าจะลบเมนูนี้?')) return;

  try {
    const response = await client.api.products[':id'].$delete({
      param: { id: id.toString() }
    });

    if (!response.ok) throw new Error('Failed to delete product');
    
    fetchProducts();
    showSuccessModal('ลบเมนูสำเร็จ!');

  } catch (error) {
    console.error("🚨 ลบเมนูล้มเหลว:", error);
    alert('เกิดข้อผิดพลาดในการลบ');
  }
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
  transition: transform 0.2s;
}
.save-btn:active { transform: scale(0.96); }

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

.item-img { 
  height: 140px; 
  background: #f3f4f6; 
  position: relative; 
  overflow: hidden; 
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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
  transition: background 0.2s;
}

.edit-btn { background: #4b5563; color: white; }
.delete-btn { background: #fee2e2; color: #ef4444; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  color: #1e293b;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

/* 🌟 Styles เฉพาะ Modal สำเร็จ */
.success-modal { padding: 40px 24px 30px 24px; text-align: center; max-width: 320px; }
.success-icon { width: 70px; height: 70px; margin: 0 auto 20px; color: #10b981; }
.success-icon svg { width: 100%; height: 100%; }
.success-modal h2 { margin: 0 0 10px 0; color: #1e293b; font-size: 24px; font-weight: 700; }
.success-modal p { color: #64748b; margin: 0 0 30px 0; font-size: 16px; }
.success-ok-btn { background: #10b981; color: white; border: none; padding: 14px 30px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; width: 100%; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); transition: transform 0.2s, background 0.2s; }
.success-ok-btn:hover { background: #059669; }
.success-ok-btn:active { transform: scale(0.96); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>