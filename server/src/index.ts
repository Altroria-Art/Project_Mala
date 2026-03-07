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

export default app