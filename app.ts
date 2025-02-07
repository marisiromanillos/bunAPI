import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { expensesRoute } from './routes/expenses';

const app = new Hono()

// Terminal Logs - Use to debug your routes
app.use('*', logger());

app.get('/api/hello', (c) => {
    return c.json({
      ok: true,
      message: 'Hello Hono!',
    })
  })

app.route("/api/expenses", expensesRoute);

export default app