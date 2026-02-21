DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS payments;

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
    table_id INTEGER NOT NULL,
    grand_total REAL NOT NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);