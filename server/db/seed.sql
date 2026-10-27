INSERT INTO plans (id, name, price, duration_days) VALUES
  (1, 'Bulanan', 100000, 30),
  (2, '6 Bulan', 300000, 180),
  (3, 'Tahunan', 500000, 365)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  duration_days = EXCLUDED.duration_days;

SELECT setval(pg_get_serial_sequence('plans', 'id'), (SELECT max(id) FROM plans));