import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  project_mala_db: D1Database;
  mala: R2Bucket;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

app.get('/', (c) => {
  return c.text('Server Mala is Running! 🍲')
})

app.get('/api/categories', async (c) => {
  try {
    const { results } = await c.env.project_mala_db.prepare(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL'
    ).all()
    const categories = results.map((row: any) => row.category)
    return c.json(categories)
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500)
  }
})

app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.project_mala_db.prepare('SELECT * FROM products').all()
    return c.json(results)
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500)
  }
})

app.post('/api/products', async (c) => {
  try {
    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const price = parseFloat(body['price'] as string);
    const stock = parseInt(body['stock'] as string);
    const cooking_type = body['cooking_type'] as string;
    const category = body['category'] as string;
    const file = body['image'] as File;

    let imageUrl = '';

    if (file && file.name) {
      const fileName = `${category}/${Date.now()}_${file.name}`; 
      await c.env.mala.put(fileName, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type }
      });
      const r2BaseUrl = "https://pub-119ea7935c6f4804a6fd5cee2df19546.r2.dev";
      imageUrl = `${r2BaseUrl}/${encodeURI(fileName)}`; 
    }

    await c.env.project_mala_db.prepare(
      "INSERT INTO products (image_url, name, price, stock, category, cooking_type) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(imageUrl, name, price, stock, category, cooking_type).run();

    return c.json({ success: true, message: 'เพิ่มเมนูสำเร็จ!' });
  } catch (e: any) {
    return c.json({ error: 'Upload Failed', message: e.message }, 500);
  }
});

app.patch('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const price = parseFloat(body['price'] as string);
    const stock = parseInt(body['stock'] as string) || 0;
    const cooking_type = body['cooking_type'] as string;
    const category = body['category'] as string;
    const file = body['image'] as File;

    let imageUrlUpdateQuery = '';
    let params: any[] = [name, price, stock, category, cooking_type];

    if (file && file.name) {

      const fileName = `${category}/${Date.now()}_${file.name}`;
      await c.env.mala.put(fileName, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type }
      });
      const imageUrl = `https://pub-119ea7935c6f4804a6fd5cee2df19546.r2.dev/${encodeURI(fileName)}`; 
      imageUrlUpdateQuery = ', image_url = ?';
      params.push(imageUrl);
    }

    params.push(id); 

    await c.env.project_mala_db.prepare(
      `UPDATE products SET name = ?, price = ?, stock = ?, category = ?, cooking_type = ?${imageUrlUpdateQuery} WHERE id = ?`
    ).bind(...params).run();
    
    return c.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' });
  } catch (e: any) {
    return c.json({ error: 'Update Failed', message: e.message }, 500);
  }
});

app.delete('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await c.env.project_mala_db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return c.json({ success: true, message: 'ลบเมนูสำเร็จ' });
  } catch (e: any) {
    return c.json({ error: 'Delete Failed', message: e.message }, 500);
  }
});

app.get('/uploads/:filename', async (c) => {
  const filename = c.req.param('filename');
  const object = await c.env.mala.get(`uploads/${filename}`);
  if (!object) return c.text('Image not found', 404);
  
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { headers });
});


// 🌟🌟🌟 แก้ไขระบบออเดอร์ตรงนี้ เพิ่มการเช็คสต๊อกก่อนสั่ง 🌟🌟🌟
app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { table_id, items, total_price, soup_type, spicy_boiled, spicy_grilled } = body;

    // 1. เช็คสต๊อกในฐานข้อมูลก่อนว่าพอไหม (ป้องกันสต๊อกติดลบ)
    for (const item of items) {
      const product = await c.env.project_mala_db.prepare(
        'SELECT stock, name FROM products WHERE id = ?'
      ).bind(item.id).first();

      // ถ้าไม่มีสินค้า หรือสต๊อกไม่พอ ให้เด้งกลับทันที ไม่บันทึกออเดอร์
      if (!product || product.stock < item.quantity) {
        return c.json({ 
          success: false, 
          message: `ขออภัยครับ "${item.name}" สต๊อกไม่พอ (เหลือ ${product ? product.stock : 0} ชิ้น)` 
        }, 400); 
      }
    }

    // 2. ถ้าสต๊อกพอ ค่อยสร้างออเดอร์
    const orderResult = await c.env.project_mala_db.prepare(
      `INSERT INTO orders (table_id, soup_type, spicy_boiled, spicy_grilled, total_price, status) 
       VALUES (?, ?, ?, ?, ?, 'unpaid') RETURNING id`
    ).bind(table_id, soup_type || null, spicy_boiled || null, spicy_grilled || null, total_price).first();

    const order_id = orderResult.id;

    for (const item of items) {
      await c.env.project_mala_db.prepare(
        `INSERT INTO order_items (order_id, product_name, cooking_type, quantity, subtotal_price) 
         VALUES (?, ?, ?, ?, ?)`
      ).bind(order_id, item.name, item.typeAddedAs || 'boiled', item.quantity, item.price * item.quantity).run();

      // ตัดสต๊อก
      await c.env.project_mala_db.prepare(
        `UPDATE products SET stock = stock - ? WHERE id = ?`
      ).bind(item.quantity, item.id).run();
    }

    return c.json({ success: true, order_id: order_id, message: "สร้างออเดอร์สำเร็จ!" });
  } catch (e: any) {
    return c.json({ error: 'Create Order Failed', message: e.message }, 500);
  }
});
// 🌟🌟🌟 สิ้นสุดส่วนที่แก้ไข 🌟🌟🌟


app.get('/api/orders/queue', async (c) => {
  try {
    const { results: orders } = await c.env.project_mala_db.prepare(
      "SELECT * FROM orders WHERE status = 'unpaid' ORDER BY created_at ASC"
    ).all();

    if (orders.length === 0) return c.json([]);

    const orderIds = orders.map((o: any) => o.id);
    const placeholders = orderIds.map(() => '?').join(',');
    
    const { results: allItems } = await c.env.project_mala_db.prepare(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders})`
    ).bind(...orderIds).all();

    const queueData = orders.map((order: any) => ({
      ...order,
      items: allItems.filter((item: any) => item.order_id === order.id)
    }));

    return c.json(queueData);
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500);
  }
});

app.get('/api/orders/tables', async (c) => {
  try {
    const { results: orders } = await c.env.project_mala_db.prepare(
      "SELECT * FROM orders WHERE status != 'paid' ORDER BY table_id ASC"
    ).all();

    const tableData = [];
    for (const order of orders) {
      const { results: items } = await c.env.project_mala_db.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(order.id).all();
      tableData.push({ ...order, items: items });
    }
    return c.json(tableData);
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500);
  }
});

app.get('/api/orders/table/:table_id', async (c) => {
  const table_id = c.req.param('table_id');
  try {
    const { results: orders } = await c.env.project_mala_db.prepare(
      "SELECT * FROM orders WHERE table_id = ? AND status != 'paid' ORDER BY created_at ASC"
    ).bind(table_id).all();

    const tableData = [];
    for (const order of orders) {
      const { results: items } = await c.env.project_mala_db.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(order.id).all();
      tableData.push({ ...order, items });
    }
    return c.json(tableData);
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500);
  }
});

app.patch('/api/orders/:id/status', async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json()
  
  try {
    await c.env.project_mala_db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, id).run()

    if (status === 'paid') {
      const order = await c.env.project_mala_db.prepare('SELECT table_id, total_price FROM orders WHERE id = ?').bind(id).first()
      if (order) {
        await c.env.project_mala_db.prepare(
          'INSERT INTO payments (order_id, table_id, grand_total) VALUES (?, ?, ?)'
        ).bind(id, order.table_id, order.total_price).run()
      }
    }
    return c.json({ success: true, message: `Order ${id} updated to ${status}` })
  } catch (e: any) {
    return c.json({ error: 'Update Failed', message: e.message }, 500)
  }
})

app.get('/api/revenue/summary', async (c) => {
  try {
    const today = await c.env.project_mala_db.prepare(
      "SELECT SUM(total_price) as total FROM orders WHERE status = 'paid' AND date(created_at, '+7 hours') = date('now', '+7 hours')"
    ).first();
    
    const countToday = await c.env.project_mala_db.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'paid' AND date(created_at, '+7 hours') = date('now', '+7 hours')"
    ).first();

    const monthly = await c.env.project_mala_db.prepare(
      "SELECT SUM(total_price) as total FROM orders WHERE status = 'paid' AND strftime('%m', created_at, '+7 hours') = strftime('%m', 'now', '+7 hours')"
    ).first();

    return c.json({
      daily_amount: today?.total || 0,
      daily_count: countToday?.count || 0,
      monthly_amount: monthly?.total || 0,
      avg_per_day: (monthly?.total || 0) / 30 
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/api/revenue/history', async (c) => {
  const date = c.req.query('date') || 'now';
  const queryDate = date === 'now' ? "date('now', '+7 hours')" : "?";
  
  try {
    const query = `SELECT o.id, o.table_id, p.paid_at as created_at, p.grand_total as total_price 
       FROM orders o
       JOIN payments p ON o.id = p.order_id
       WHERE o.status = 'paid' AND date(p.paid_at, '+7 hours') = ${queryDate}
       ORDER BY p.paid_at DESC`;

    const stmt = date === 'now' 
      ? c.env.project_mala_db.prepare(query)
      : c.env.project_mala_db.prepare(query).bind(date);

    const { results } = await stmt.all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/api/revenue/items', async (c) => {
  const date = c.req.query('date') || 'now';
  const queryDate = date === 'now' ? "date('now', '+7 hours')" : "?";

  try {
    const query = `SELECT 
        oi.product_name as name, 
        p.category, 
        SUM(oi.quantity) as quantity, 
        SUM(oi.subtotal_price) as total
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       LEFT JOIN products p ON oi.product_name = p.name
       WHERE o.status = 'paid' AND date(o.created_at, '+7 hours') = ${queryDate}
       GROUP BY oi.product_name, p.category
       ORDER BY quantity DESC`;

    const stmt = date === 'now' 
      ? c.env.project_mala_db.prepare(query)
      : c.env.project_mala_db.prepare(query).bind(date);

    const { results } = await stmt.all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/api/revenue/monthly', async (c) => {
  const date = c.req.query('date') || 'now';
  const queryDate = date === 'now' ? "strftime('%Y-%m', 'now', '+7 hours')" : "strftime('%Y-%m', ?)";

  try {
    const query = `SELECT 
        date(p.paid_at, '+7 hours') as date, 
        COUNT(o.id) as bill_count, 
        SUM(p.grand_total) as total_sales
       FROM orders o
       JOIN payments p ON o.id = p.order_id
       WHERE o.status = 'paid' 
         AND strftime('%Y-%m', p.paid_at, '+7 hours') = ${queryDate}
       GROUP BY date(p.paid_at, '+7 hours')
       ORDER BY date DESC`;

    const stmt = date === 'now' 
      ? c.env.project_mala_db.prepare(query)
      : c.env.project_mala_db.prepare(query).bind(date);

    const { results } = await stmt.all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app