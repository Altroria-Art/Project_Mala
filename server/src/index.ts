import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  project_mala_db: any 
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

app.get('/', (c) => {
  return c.text('Server Mala is Running! 🍲')
})

app.get('/api/products', async (c) => {
  try {
    // ดึงเฉพาะเมนูที่ยังไม่ถูกลบ
    const { results } = await c.env.project_mala_db.prepare('SELECT * FROM products WHERE is_deleted = 0').all()
    return c.json(results)
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500)
  }
})

// === เพิ่ม API สำหรับอัปเดตข้อมูลเมนู ===
app.patch('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  
  try {
    await c.env.project_mala_db.prepare(
      `UPDATE products 
       SET name = ?, price = ?, stock = ?, category = ?, cooking_type = ?, image_url = ?
       WHERE id = ?`
    ).bind(
      body.name, 
      body.price, 
      body.stock, 
      body.category, 
      body.cooking_type, 
      body.image_url, 
      id
    ).run()
    
    return c.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' })
  } catch (e: any) {
    return c.json({ error: 'Update Failed', message: e.message }, 500)
  }
})

// === เพิ่ม API สำหรับ Soft Delete เมนู ===
app.patch('/api/products/:id/delete', async (c) => {
  const id = c.req.param('id')
  
  try {
    await c.env.project_mala_db.prepare(
      'UPDATE products SET is_deleted = 1 WHERE id = ?'
    ).bind(id).run()
    
    return c.json({ success: true, message: 'ลบเมนูสำเร็จ' })
  } catch (e: any) {
    return c.json({ error: 'Delete Failed', message: e.message }, 500)
  }
})

// ดึงข้อมูลคิวอาหาร (ออเดอร์ที่ยังไม่จ่ายเงิน/รอทำ)
app.get('/api/orders/queue', async (c) => {
  try {
    const { results: orders } = await c.env.project_mala_db.prepare(
      "SELECT * FROM orders WHERE status = 'unpaid' ORDER BY created_at ASC"
    ).all();

    const queueData = [];
    for (const order of orders) {
      const { results: items } = await c.env.project_mala_db.prepare(
        "SELECT * FROM order_items WHERE order_id = ?"
      ).bind(order.id).all();

      queueData.push({
        ...order,
        items: items 
      });
    }

    return c.json(queueData);
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500);
  }
});

// API สำหรับเปลี่ยนสถานะออเดอร์
app.patch('/api/orders/:id/status', async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json()
  
  try {
    await c.env.project_mala_db.prepare(
      'UPDATE orders SET status = ? WHERE id = ?'
    ).bind(status, id).run()
    
    return c.json({ success: true, message: `Order ${id} updated to ${status}` })
  } catch (e: any) {
    return c.json({ error: 'Update Failed', message: e.message }, 500)
  }
})

// ดึงข้อมูลบิลรายโต๊ะ
app.get('/api/orders/tables', async (c) => {
  try {
    const { results: orders } = await c.env.project_mala_db.prepare(
      "SELECT * FROM orders WHERE status != 'paid' ORDER BY table_id ASC"
    ).all();

    const tableData = [];
    for (const order of orders) {
      const { results: items } = await c.env.project_mala_db.prepare(
        "SELECT * FROM order_items WHERE order_id = ?"
      ).bind(order.id).all();

      tableData.push({
        ...order,
        items: items
      });
    }

    return c.json(tableData);
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500);
  }
});

app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { table_id, items, total_price, soup_type, spicy_boiled, spicy_grilled } = body;

    const orderResult = await c.env.project_mala_db.prepare(
      `INSERT INTO orders (table_id, soup_type, spicy_boiled, spicy_grilled, total_price, status) 
       VALUES (?, ?, ?, ?, ?, 'unpaid') RETURNING id`
    ).bind(
      table_id, 
      soup_type || null, 
      spicy_boiled || null, 
      spicy_grilled || null, 
      total_price
    ).first();

    const order_id = orderResult.id;

    for (const item of items) {
      await c.env.project_mala_db.prepare(
        `INSERT INTO order_items (order_id, product_name, cooking_type, quantity, subtotal_price) 
         VALUES (?, ?, ?, ?, ?)`
      ).bind(
        order_id, 
        item.name, 
        item.typeAddedAs, 
        item.quantity, 
        item.price * item.quantity
      ).run();
    }

    return c.json({ success: true, order_id: order_id, message: "สร้างออเดอร์สำเร็จ!" });
  } catch (e: any) {
    return c.json({ error: 'Create Order Failed', message: e.message }, 500);
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
      const { results: items } = await c.env.project_mala_db.prepare(
        "SELECT * FROM order_items WHERE order_id = ?"
      ).bind(order.id).all();

      tableData.push({ ...order, items });
    }

    return c.json(tableData);
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500);
  }
});

export default app