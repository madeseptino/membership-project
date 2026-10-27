import express from 'express'
import { query } from './db.js'
import plansRouter from './routes/plans.js'
import registerRouter from './routes/register.js'
import statusRouter from './routes/status.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use('/api/status', statusRouter)
app.use('/api/register', registerRouter)

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

app.use('/api/plans', plansRouter)

// Endpoint /api yang tidak dikenal
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' })
})

// Penanganan error terakhir: semua error dari route jatuh ke sini
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
})

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})