-- apps/api/migrations/002_create_finance.sql
CREATE TABLE IF NOT EXISTS transactions (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_cents BIGINT NOT NULL CHECK (amount_cents <> 0),
    category     TEXT NOT NULL,
    date         DATE NOT NULL,
    note         TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id_date ON transactions(user_id, date DESC);

CREATE TABLE IF NOT EXISTS budgets (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category     TEXT NOT NULL,
    limit_cents  BIGINT NOT NULL CHECK (limit_cents > 0),
    month        DATE NOT NULL CHECK (date_trunc('month', month) = month),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, category, month)
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);

CREATE TABLE IF NOT EXISTS assets (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    value_cents  BIGINT NOT NULL CHECK (value_cents >= 0),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX idx_assets_user_id ON assets(user_id);

CREATE TABLE IF NOT EXISTS liabilities (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    value_cents  BIGINT NOT NULL CHECK (value_cents >= 0),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX idx_liabilities_user_id ON liabilities(user_id);

CREATE TABLE IF NOT EXISTS subscriptions (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    amount_cents  BIGINT NOT NULL CHECK (amount_cents > 0),
    cycle         TEXT NOT NULL CHECK (cycle IN ('weekly', 'monthly', 'yearly')),
    next_renewal  DATE NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id    ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_next_renewal ON subscriptions(next_renewal);
