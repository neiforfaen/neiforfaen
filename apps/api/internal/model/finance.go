package model

import "time"

// Transactions

type Transaction struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	AmountCents int64     `json:"amount_cents"`
	Category    string    `json:"category"`
	Date        time.Time `json:"date"`
	Note        string    `json:"note"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateTransactionRequest struct {
	AmountCents int64  `json:"amount_cents"`
	Category    string `json:"category"`
	Date        string `json:"date"` // YYYY-MM-DD
	Note        string `json:"note"`
}

// Budgets

type Budget struct {
	ID         int64     `json:"id"`
	UserID     int64     `json:"user_id"`
	Category   string    `json:"category"`
	LimitCents int64     `json:"limit_cents"`
	Month      time.Time `json:"month"`
	CreatedAt  time.Time `json:"created_at"`
}

type UpsertBudgetRequest struct {
	Category   string `json:"category"`
	LimitCents int64  `json:"limit_cents"`
	Month      string `json:"month"` // YYYY-MM-DD (first of month)
}

// Net worth

type Asset struct {
	ID         int64     `json:"id"`
	UserID     int64     `json:"user_id"`
	Name       string    `json:"name"`
	ValueCents int64     `json:"value_cents"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type UpsertAssetRequest struct {
	Name       string `json:"name"`
	ValueCents int64  `json:"value_cents"`
}

type Liability struct {
	ID         int64     `json:"id"`
	UserID     int64     `json:"user_id"`
	Name       string    `json:"name"`
	ValueCents int64     `json:"value_cents"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type UpsertLiabilityRequest struct {
	Name       string `json:"name"`
	ValueCents int64  `json:"value_cents"`
}

type NetWorthResponse struct {
	Assets      []Asset     `json:"assets"`
	Liabilities []Liability `json:"liabilities"`
	TotalCents  int64       `json:"total_cents"`
}

// Subscriptions

type Subscription struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	Name        string    `json:"name"`
	AmountCents int64     `json:"amount_cents"`
	Cycle       string    `json:"cycle"` // weekly | monthly | yearly
	NextRenewal time.Time `json:"next_renewal"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateSubscriptionRequest struct {
	Name        string `json:"name"`
	AmountCents int64  `json:"amount_cents"`
	Cycle       string `json:"cycle"`        // weekly | monthly | yearly
	NextRenewal string `json:"next_renewal"` // YYYY-MM-DD
}
