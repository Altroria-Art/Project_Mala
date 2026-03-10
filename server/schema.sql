DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    category TEXT,
    cooking_type TEXT,
    is_deleted INTEGER DEFAULT 0
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

INSERT INTO products (image_url, name, price, stock, category, cooking_type, is_deleted)
VALUES (
    'https://pub-119ea7935c6f4804a6fd5cee2df19546.r2.dev/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B8%B7%E0%B9%88%E0%B8%A1/1773163211275_coke_1_10_bath.jpg', 
    'โค้ก (1 ขวด)', 
    10, 
    100, 
    'เครื่องดื่ม', 
    'ready', 
    0
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_table_status ON orders(table_id, status);

CREATE INDEX idx_products_category ON products(category);
CREATE UNIQUE INDEX idx_products_name ON products(name);

CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);