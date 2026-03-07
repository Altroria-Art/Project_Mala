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
    const { results } = await c.env.project_mala_db.prepare('SELECT * FROM products').all()
    return c.json(results)
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500)
  }
})

// ดึงข้อมูลคิวอาหาร (ออเดอร์ที่ยังไม่จ่ายเงิน/รอทำ)
app.get('/api/orders/queue', async (c) => {
  try {
    // 1. ดึงข้อมูลออเดอร์หลัก
    const { results: orders } = await c.env.project_mala_db.prepare(
      "SELECT * FROM orders WHERE status = 'unpaid' ORDER BY created_at ASC"
    ).all();

    // 2. ดึงรายการอาหารของแต่ละออเดอร์ไปใส่ไว้ด้วยกัน
    const queueData = [];
    for (const order of orders) {
      const { results: items } = await c.env.project_mala_db.prepare(
        "SELECT * FROM order_items WHERE order_id = ?"
      ).bind(order.id).all();

      queueData.push({
        ...order,
        items: items // แนบรายการอาหารไปกับออเดอร์
      });
    }

    return c.json(queueData);
  } catch (e: any) {
    return c.json({ error: 'Database Error', message: e.message }, 500);
  }
});

// API สำหรับเปลี่ยนสถานะออเดอร์ (เช่น จาก unpaid -> cooking)
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

export default app