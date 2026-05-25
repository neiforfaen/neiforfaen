package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/neiforfaen/neiforfaen/apps/api/internal/model"
)

type FinanceRepository interface {
	ListTransactions(ctx context.Context, userID int64, page, limit int) ([]model.Transaction, int64, error)
	CreateTransaction(ctx context.Context, userID int64, req *model.CreateTransactionRequest) (*model.Transaction, error)
	DeleteTransaction(ctx context.Context, userID, id int64) error

	ListBudgets(ctx context.Context, userID int64, month time.Time) ([]model.Budget, error)
	UpsertBudget(ctx context.Context, userID int64, req *model.UpsertBudgetRequest) (*model.Budget, error)

	ListAssets(ctx context.Context, userID int64) ([]model.Asset, error)
	UpsertAsset(ctx context.Context, userID int64, req *model.UpsertAssetRequest) (*model.Asset, error)
	DeleteAsset(ctx context.Context, userID, id int64) error

	ListLiabilities(ctx context.Context, userID int64) ([]model.Liability, error)
	UpsertLiability(ctx context.Context, userID int64, req *model.UpsertLiabilityRequest) (*model.Liability, error)
	DeleteLiability(ctx context.Context, userID, id int64) error

	ListSubscriptions(ctx context.Context, userID int64) ([]model.Subscription, error)
	CreateSubscription(ctx context.Context, userID int64, req *model.CreateSubscriptionRequest) (*model.Subscription, error)
	DeleteSubscription(ctx context.Context, userID, id int64) error
}

type pgFinanceRepository struct {
	pool *pgxpool.Pool
}

func NewFinanceRepository(pool *pgxpool.Pool) FinanceRepository {
	return &pgFinanceRepository{pool: pool}
}

// --- Transactions ---

func (r *pgFinanceRepository) ListTransactions(ctx context.Context, userID int64, page, limit int) ([]model.Transaction, int64, error) {
	offset := (page - 1) * limit
	rows, err := r.pool.Query(ctx, `
		SELECT id, user_id, amount_cents, category, date, note, created_at
		FROM transactions
		WHERE user_id = $1
		ORDER BY date DESC
		LIMIT $2 OFFSET $3`,
		userID, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("financeRepo.ListTransactions: %w", err)
	}
	defer rows.Close()

	var out []model.Transaction
	for rows.Next() {
		var t model.Transaction
		if err := rows.Scan(&t.ID, &t.UserID, &t.AmountCents, &t.Category, &t.Date, &t.Note, &t.CreatedAt); err != nil {
			return nil, 0, fmt.Errorf("financeRepo.ListTransactions scan: %w", err)
		}
		out = append(out, t)
	}

	var total int64
	if err := r.pool.QueryRow(ctx, `SELECT COUNT(*) FROM transactions WHERE user_id = $1`, userID).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("financeRepo.ListTransactions count: %w", err)
	}
	return out, total, nil
}

func (r *pgFinanceRepository) CreateTransaction(ctx context.Context, userID int64, req *model.CreateTransactionRequest) (*model.Transaction, error) {
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.CreateTransaction: invalid date: %w", err)
	}
	var t model.Transaction
	err = r.pool.QueryRow(ctx, `
		INSERT INTO transactions (user_id, amount_cents, category, date, note)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, amount_cents, category, date, note, created_at`,
		userID, req.AmountCents, req.Category, date, req.Note).
		Scan(&t.ID, &t.UserID, &t.AmountCents, &t.Category, &t.Date, &t.Note, &t.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.CreateTransaction: %w", err)
	}
	return &t, nil
}

func (r *pgFinanceRepository) DeleteTransaction(ctx context.Context, userID, id int64) error {
	if _, err := r.pool.Exec(ctx, `DELETE FROM transactions WHERE id = $1 AND user_id = $2`, id, userID); err != nil {
		return fmt.Errorf("financeRepo.DeleteTransaction: %w", err)
	}
	return nil
}

// --- Budgets ---

func (r *pgFinanceRepository) ListBudgets(ctx context.Context, userID int64, month time.Time) ([]model.Budget, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, user_id, category, limit_cents, month, created_at
		FROM budgets
		WHERE user_id = $1 AND month = $2
		ORDER BY category`,
		userID, month)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.ListBudgets: %w", err)
	}
	defer rows.Close()

	var out []model.Budget
	for rows.Next() {
		var b model.Budget
		if err := rows.Scan(&b.ID, &b.UserID, &b.Category, &b.LimitCents, &b.Month, &b.CreatedAt); err != nil {
			return nil, fmt.Errorf("financeRepo.ListBudgets scan: %w", err)
		}
		out = append(out, b)
	}
	return out, nil
}

func (r *pgFinanceRepository) UpsertBudget(ctx context.Context, userID int64, req *model.UpsertBudgetRequest) (*model.Budget, error) {
	month, err := time.Parse("2006-01-02", req.Month)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.UpsertBudget: invalid month: %w", err)
	}
	var b model.Budget
	err = r.pool.QueryRow(ctx, `
		INSERT INTO budgets (user_id, category, limit_cents, month)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id, category, month) DO UPDATE SET limit_cents = EXCLUDED.limit_cents
		RETURNING id, user_id, category, limit_cents, month, created_at`,
		userID, req.Category, req.LimitCents, month).
		Scan(&b.ID, &b.UserID, &b.Category, &b.LimitCents, &b.Month, &b.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.UpsertBudget: %w", err)
	}
	return &b, nil
}

// --- Assets ---

func (r *pgFinanceRepository) ListAssets(ctx context.Context, userID int64) ([]model.Asset, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, user_id, name, value_cents, updated_at FROM assets WHERE user_id = $1 ORDER BY name`,
		userID)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.ListAssets: %w", err)
	}
	defer rows.Close()

	var out []model.Asset
	for rows.Next() {
		var a model.Asset
		if err := rows.Scan(&a.ID, &a.UserID, &a.Name, &a.ValueCents, &a.UpdatedAt); err != nil {
			return nil, fmt.Errorf("financeRepo.ListAssets scan: %w", err)
		}
		out = append(out, a)
	}
	return out, nil
}

func (r *pgFinanceRepository) UpsertAsset(ctx context.Context, userID int64, req *model.UpsertAssetRequest) (*model.Asset, error) {
	var a model.Asset
	err := r.pool.QueryRow(ctx, `
		INSERT INTO assets (user_id, name, value_cents)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, name) DO UPDATE SET value_cents = EXCLUDED.value_cents, updated_at = NOW()
		RETURNING id, user_id, name, value_cents, updated_at`,
		userID, req.Name, req.ValueCents).
		Scan(&a.ID, &a.UserID, &a.Name, &a.ValueCents, &a.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.UpsertAsset: %w", err)
	}
	return &a, nil
}

func (r *pgFinanceRepository) DeleteAsset(ctx context.Context, userID, id int64) error {
	if _, err := r.pool.Exec(ctx, `DELETE FROM assets WHERE id = $1 AND user_id = $2`, id, userID); err != nil {
		return fmt.Errorf("financeRepo.DeleteAsset: %w", err)
	}
	return nil
}

// --- Liabilities ---

func (r *pgFinanceRepository) ListLiabilities(ctx context.Context, userID int64) ([]model.Liability, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, user_id, name, value_cents, updated_at FROM liabilities WHERE user_id = $1 ORDER BY name`,
		userID)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.ListLiabilities: %w", err)
	}
	defer rows.Close()

	var out []model.Liability
	for rows.Next() {
		var l model.Liability
		if err := rows.Scan(&l.ID, &l.UserID, &l.Name, &l.ValueCents, &l.UpdatedAt); err != nil {
			return nil, fmt.Errorf("financeRepo.ListLiabilities scan: %w", err)
		}
		out = append(out, l)
	}
	return out, nil
}

func (r *pgFinanceRepository) UpsertLiability(ctx context.Context, userID int64, req *model.UpsertLiabilityRequest) (*model.Liability, error) {
	var l model.Liability
	err := r.pool.QueryRow(ctx, `
		INSERT INTO liabilities (user_id, name, value_cents)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, name) DO UPDATE SET value_cents = EXCLUDED.value_cents, updated_at = NOW()
		RETURNING id, user_id, name, value_cents, updated_at`,
		userID, req.Name, req.ValueCents).
		Scan(&l.ID, &l.UserID, &l.Name, &l.ValueCents, &l.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.UpsertLiability: %w", err)
	}
	return &l, nil
}

func (r *pgFinanceRepository) DeleteLiability(ctx context.Context, userID, id int64) error {
	if _, err := r.pool.Exec(ctx, `DELETE FROM liabilities WHERE id = $1 AND user_id = $2`, id, userID); err != nil {
		return fmt.Errorf("financeRepo.DeleteLiability: %w", err)
	}
	return nil
}

// --- Subscriptions ---

func (r *pgFinanceRepository) ListSubscriptions(ctx context.Context, userID int64) ([]model.Subscription, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, user_id, name, amount_cents, cycle, next_renewal, created_at FROM subscriptions WHERE user_id = $1 ORDER BY next_renewal`,
		userID)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.ListSubscriptions: %w", err)
	}
	defer rows.Close()

	var out []model.Subscription
	for rows.Next() {
		var s model.Subscription
		if err := rows.Scan(&s.ID, &s.UserID, &s.Name, &s.AmountCents, &s.Cycle, &s.NextRenewal, &s.CreatedAt); err != nil {
			return nil, fmt.Errorf("financeRepo.ListSubscriptions scan: %w", err)
		}
		out = append(out, s)
	}
	return out, nil
}

func (r *pgFinanceRepository) CreateSubscription(ctx context.Context, userID int64, req *model.CreateSubscriptionRequest) (*model.Subscription, error) {
	renewal, err := time.Parse("2006-01-02", req.NextRenewal)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.CreateSubscription: invalid next_renewal: %w", err)
	}
	var s model.Subscription
	err = r.pool.QueryRow(ctx, `
		INSERT INTO subscriptions (user_id, name, amount_cents, cycle, next_renewal)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, name, amount_cents, cycle, next_renewal, created_at`,
		userID, req.Name, req.AmountCents, req.Cycle, renewal).
		Scan(&s.ID, &s.UserID, &s.Name, &s.AmountCents, &s.Cycle, &s.NextRenewal, &s.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("financeRepo.CreateSubscription: %w", err)
	}
	return &s, nil
}

func (r *pgFinanceRepository) DeleteSubscription(ctx context.Context, userID, id int64) error {
	if _, err := r.pool.Exec(ctx, `DELETE FROM subscriptions WHERE id = $1 AND user_id = $2`, id, userID); err != nil {
		return fmt.Errorf("financeRepo.DeleteSubscription: %w", err)
	}
	return nil
}
