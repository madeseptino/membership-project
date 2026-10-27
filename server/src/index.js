import express from 'express'
import { query } from './db.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/api/health', async (req, res) => {
  const timeResult = await query('SELECT now() AS db_time')
  const tableResult = await query(
    `SELECT count(*)::int AS table_count
     FROM information_schema.tables
     WHERE table_schema = 'public'`,
  )

  res.json({
    status: 'ok',
    dbTime: timeResult.rows[0].db_time,
    tableCount: tableResult.rows[0].table_count,
  })
})

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})