
CREATE TYPE transaction_status AS ENUM
  ('pending', 'paid', 'failed', 'cancelled', 'expired', 'refunded');

CREATE TABLE plans (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(50)  NOT NULL,
  price         INTEGER      NOT NULL CHECK (price > 0),
  duration_days INTEGER      NOT NULL CHECK (duration_days IN (30, 180, 365)),
  is_active     BOOLEAN      NOT NULL DEFAULT true
);

CREATE TABLE members (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(20)  NOT NULL,
  active_until TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id               SERIAL PRIMARY KEY,
  order_id         VARCHAR(50)  NOT NULL UNIQUE,
  member_id        INTEGER      NOT NULL REFERENCES members(id),
  plan_id          INTEGER      NOT NULL REFERENCES plans(id),
  amount           INTEGER      NOT NULL,
  status           transaction_status NOT NULL DEFAULT 'pending',
  midtrans_status  VARCHAR(20),
  payment_type     VARCHAR(30),
  snap_token       VARCHAR(255),
  needs_refund     BOOLEAN      NOT NULL DEFAULT false,
  expires_at       TIMESTAMPTZ  NOT NULL,
  paid_at          TIMESTAMPTZ,
  raw_notification JSONB,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE payment_notifications (
  id              SERIAL PRIMARY KEY,
  order_id        VARCHAR(50)  NOT NULL,
  midtrans_status VARCHAR(20),
  signature_valid BOOLEAN      NOT NULL,
  payload         JSONB        NOT NULL,
  received_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);