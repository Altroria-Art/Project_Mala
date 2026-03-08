-- 1. ลบตารางลูกก่อน (เพื่อไม่ให้ติด Foreign Key)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
-- 2. ลบตารางแม่ทีหลัง
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

-- 3. สร้างตารางใหม่
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    category TEXT,
    cooking_type TEXT
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id INTEGER NOT NULL,
    order_number INTEGER DEFAULT 1,
    soup_type TEXT,
    spicy_boiled TEXT,
    spicy_grilled TEXT,
    total_price REAL DEFAULT 0,
    status TEXT DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    cooking_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,     
    table_id INTEGER NOT NULL,
    grand_total REAL NOT NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) 
);

-- 4. ใส่ข้อมูลสินค้า (เมนูทั้งหมดของคุณ)
INSERT INTO products (image_url, name, price, stock, category, cooking_type) VALUES
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_chicken_2_5_bath.jpg', 'เนื้อไก่ (2 ชิ้น)', 5.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_dolly_fish_1_5_bath.jpg', 'ปลาดอลลี่ (1 ชิ้น)', 5.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_enoki_pork_wrap_2_10_bath.jpg', 'สามชั้นพันเห็ดเข็มทอง (2 ไม้)', 10.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_jellyfish_3_10_bath.jpg', 'แมงกะพรุน (3 ชิ้น)', 10.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_minced_pork_1_25_bath.jpg', 'หมูเด้ง (1 ถุง)', 25.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_pork_belly_2_5_bath.jpg', 'หมูสามชั้น (2 ชิ้น)', 5.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_pork_liver_2_5_bath.jpg', 'ตับหมู (2 ชิ้น)', 5.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_pork_slide_2_5_bath.jpg', 'หมูสไลด์ (2 ชิ้น)', 5.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/boiled_squid_3_10_bath.jpg', 'ปลาหมึก (3 ชิ้น)', 10.0, 1000, 'Meat', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/grilled_beef_1_10_bath.jpg', 'เนื้อโคขุน (1 ไม้)', 10.0, 1000, 'Meat', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/grilled_chitterlings_1_10_bath.jpg', 'ไส้ย่าง (1 ไม้)', 10.0, 1000, 'Meat', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/grilled_enoki_pork_wrap_2_10_bath.jpg', 'สามชั้นพันเห็ดเข็มทองย่าง (2 ไม้)', 10.0, 1000, 'Meat', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/grilled_marinated_chicken_1_10_bath.jpg', 'ไก่หมัก (1 ไม้)', 10.0, 1000, 'Meat', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/grilled_marinated_pork_1_10_bath.jpg', 'หมูหมัก (1 ไม้)', 10.0, 1000, 'Meat', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/grilled_pork_belly_1_10_bath.jpg', 'หมูสามชั้นย่าง (1 ไม้)', 10.0, 1000, 'Meat', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Meat/grilled_pork_liver_1_10_bath.jpg', 'ตับหมูย่าง (1 ไม้)', 10.0, 1000, 'Meat', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_bologna_chicken_3_5_bath.jpg', 'โบโลน่าไก่ (3 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_cheese_ball_1_5_bath.jpg', 'ชีสบอล (1 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_crab_stick_2_5_bath.jpg', 'ปูอัด (2 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_crispy_skin_sausage_1_5_bath.jpg', 'ไส้กรอกหนังกรอบ (1 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_egg_tofu_1_10_bath.jpg', 'เต้าหู้ไข่ (1 หลอด)', 10.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_fish_roe_ball_1_5_bath.jpg', 'ลูกชิ้นไข่ปลา (1 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_seafood_tofu_2_5_bath.jpg', 'ฟองเต้าหู้ซีฟู้ด (2 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_sheet_fish_tofu_1_10_bath.jpg', 'เต้าหู้ปลาแผ่น (1 ชิ้น)', 10.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_tofu_ball_2_5_bath.jpg', 'ลูกชิ้นเต้าหู้ (2 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/boiled_tofu_sheet_3_5_bath.jpg', 'เต้าหู้แผ่น (3 ชิ้น)', 5.0, 1000, 'Appetizer', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/grilled_crab_stick_1_5_bath.jpg', 'ปูอัดย่าง (1 ไม้)', 5.0, 1000, 'Appetizer', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/grilled_fish_ball_1_10_bath.jpg', 'ลูกชิ้นปลาย่าง (1 ไม้)', 10.0, 1000, 'Appetizer', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/grilled_fish_tofu_1_5_bath.jpg', 'เต้าหู้ปลาย่าง (1 ไม้)', 5.0, 1000, 'Appetizer', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Appetizer/grilled_sausage_1_5_bath.jpg', 'ไส้กรอกย่าง (1 ไม้)', 5.0, 1000, 'Appetizer', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_baby_corn_2_5_bath.jpg', 'ข้าวโพดอ่อน (2 ชิ้น)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_broccoli_3_5_bath.jpg', 'บร็อคโคลี่ (3 ชิ้น)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_chinese_cabbage_3_5_bath.jpg', 'ผักกาดขาว (3 ชิ้น)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_choy_sum_3_5_bath.jpg', 'กวางตุ้ง (3 ชิ้น)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_enoki_mushroom_1_5_bath.jpg', 'เห็ดเข็มทอง (1 คีป)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_eryngii_mushroom_3_5_bath.jpg', 'เห็ดออรินจิ (3 ชิ้น)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_morning_glory_1_5_bath.jpg', 'ผักบุ้ง (1 คีป)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_okra_2_5_bath.jpg', 'กระเจี๊ยบเขียว (2 ชิ้น)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_wakame_seaweed_1_10_bath.jpg', 'สาหร่ายวากาเมะ (1 คีป)', 10.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/boiled_white_shimeji_1_5_bath.jpg', 'เห็ดชิเมจิขาว (1 คีป)', 5.0, 1000, 'vegetable', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/grilled_baby_corn_1_5_bath.jpg', 'ข้าวโพดอ่อนย่าง (1 ไม้)', 5.0, 1000, 'vegetable', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/grilled_broccoli_1_5_bath.jpg', 'บร็อคโคลี่ย่าง (1 ไม้)', 5.0, 1000, 'vegetable', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/grilled_eryngii_mushroom_1_5_bath.jpg', 'เห็ดออรินจิย่าง (1 ไม้)', 5.0, 1000, 'vegetable', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/vegetable/grilled_okra_1_10_bath.jpg', 'กระเจี๊ยบเขียวย่าง (1 ไม้)', 10.0, 1000, 'vegetable', 'grilled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Others/boiled_sweet_potato_noodles_1_15_bath.jpg', 'เส้นมันเทศ', 15.0, 1000, 'Others', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Others/boiled_vermicelli_1_15_bath.jpg', 'เส้นบุกขาว', 15.0, 1000, 'Others', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Others/boiled_instant_noodles_1_10_bath.jpg', 'มาม่า', 10.0, 1000, 'Others', 'boiled'),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Others/steamed_rice_1_15_bath.jpg', 'ข้าวสวย', 15.0, 1000, 'Others', NULL),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Beverage/coke_1_10_bath.jpg', 'โค้ก (1 ขวด)', 10.0, 1000, 'Beverage', NULL),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Beverage/pepsi_1_10_bath.jpg', 'เป๊ปซี่ (1 ขวด)', 10.0, 1000, 'Beverage', NULL),
('https://pub-17c841dc329349f081a01a422b92e695.r2.dev/Beverage/liptan_1_10_bath.jpg', 'ลิปตัน (1 ขวด)', 10.0, 1000, 'Beverage', NULL);

-- 5. ใส่ข้อมูลออเดอร์จำลองแบบระบุ ID (ไม่มีทาง Error แน่นอน)
INSERT INTO orders (id, table_id, order_number, soup_type, spicy_boiled, spicy_grilled, total_price, status) 
VALUES (1, 1, 1, 'หม่าล่านม', 'เผ็ดมาก', 'เผ็ดกลาง', 65.0, 'unpaid');
INSERT INTO order_items (order_id, product_name, cooking_type, quantity, subtotal_price) VALUES 
(1, 'หมูสไลด์ (2 ชิ้น)', 'boiled', 3, 15.0),
(1, 'บร็อคโคลี่ย่าง (1 ไม้)', 'grilled', 4, 20.0),
(1, 'สามชั้นพันเห็ดเข็มทองย่าง (2 ไม้)', 'grilled', 3, 30.0);

INSERT INTO orders (id, table_id, order_number, soup_type, spicy_boiled, spicy_grilled, total_price, status) 
VALUES (2, 2, 1, 'หม่าล่าเผ็ดชา', 'เผ็ดกลาง', 'เผ็ดกลาง', 65.0, 'cooking');
INSERT INTO order_items (order_id, product_name, cooking_type, quantity, subtotal_price) VALUES 
(2, 'เนื้อไก่ (2 ชิ้น)', 'boiled', 2, 10.0),
(2, 'ไส้ย่าง (1 ไม้)', 'grilled', 3, 30.0),
(2, 'หมูเด้ง (1 ถุง)', 'boiled', 1, 25.0);

INSERT INTO orders (id, table_id, order_number, soup_type, spicy_boiled, spicy_grilled, total_price, status) 
VALUES (3, 2, 2, 'ซุปใส', 'ไม่เผ็ด', 'ไม่เผ็ด', 35.0, 'unpaid');
INSERT INTO order_items (order_id, product_name, cooking_type, quantity, subtotal_price) VALUES 
(3, 'ข้าวสวย', 'ready', 1, 15.0),
(3, 'เต้าหู้ไข่ (1 หลอด)', 'boiled', 2, 20.0);

INSERT INTO orders (id, table_id, order_number, soup_type, spicy_boiled, spicy_grilled, total_price, status) 
VALUES (4, 5, 1, 'ซุปกระดูกหมู', 'เผ็ดน้อย', 'เผ็ดน้อย', 80.0, 'served');
INSERT INTO order_items (order_id, product_name, cooking_type, quantity, subtotal_price) VALUES 
(4, 'หมูสามชั้นย่าง (1 ไม้)', 'grilled', 5, 50.0),
(4, 'เห็ดเข็มทอง (1 คีป)', 'boiled', 2, 10.0),
(4, 'ชีสบอล (1 ชิ้น)', 'boiled', 4, 20.0);

INSERT INTO orders (id, table_id, order_number, soup_type, spicy_boiled, spicy_grilled, total_price, status) 
VALUES (5, 1, 2, 'หม่าล่านม', 'เผ็ดมาก', 'เผ็ดมาก', 85.0, 'unpaid');
INSERT INTO order_items (order_id, product_name, cooking_type, quantity, subtotal_price) VALUES 
(5, 'แมงกะพรุน (3 ชิ้น)', 'boiled', 2, 20.0),
(5, 'ลูกชิ้นปลาย่าง (1 ไม้)', 'grilled', 3, 30.0),
(5, 'สามชั้นพันเห็ดเข็มทองย่าง (2 ไม้)', 'grilled', 2, 20.0),
(5, 'ข้าวโพดอ่อน (2 ชิ้น)', 'boiled', 3, 15.0);