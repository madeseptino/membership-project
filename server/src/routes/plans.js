import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  const result = await query(
    `SELECT id, name, price, duration_days AS "durationDays"
     FROM plans
     WHERE is_active = true
     ORDER BY price`,
  )
  res.json(result.rows)
})

export default router