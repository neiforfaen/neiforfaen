package service

import (
	"context"
	"fmt"
	"time"

	"github.com/neiforfaen/neiforfaen/apps/api/internal/model"
	"github.com/neiforfaen/neiforfaen/apps/api/internal/repository"
)

type FinanceService interface {
	ListTransactions(ctx context.Context, userID int64, page, limit int) (*model.PaginatedResponse[model.Transaction], error)
	CreateTransaction(ctx context.Context, userID int64, req *model.CreateTransactionRequest) (*model.Transaction, error)
	DeleteTransaction(ctx context.Context, userID, id int64) error

	ListBudgets(ctx context.Context, userID int64, month time.Time) ([]model.Budget, error)
	UpsertBudget(ctx context.Context, userID int64, req *model.UpsertBudgetRequest) (*model.Budget, error)

	GetNetWorth(ctx context.Context, userID int64) (*model.NetWorthResponse, error)
	UpsertAsset(ctx context.Context, userID int64, req *model.UpsertAssetRequest) (*model.Asset, error)
	DeleteAsset(ctx context.Context, userID, id int64) error
	UpsertLiability(ctx context.Context, userID int64, req *model.UpsertLiabilityRequest) (*model.Liability, error)
	DeleteLiability(ctx context.Context, userID, id int64) error

	ListSubscriptions(ctx context.Context, userID int64) ([]model.Subscription, error)
	CreateSubscription(ctx context.Context, userID int64, req *model.CreateSubscriptionRequest) (*model.Subscription, error)
	DeleteSubscription(ctx context.Context, userID, id int64) error
}

type financeService struct {
	repo repository.FinanceRepository
}

func NewFinanceService(repo repository.FinanceRepository) FinanceService {
	return &financeService{repo: repo}
}

func (s *financeService) ListTransactions(ctx context.Context, userID int64, page, limit int) (*model.PaginatedResponse[model.Transaction], error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	data, total, err := s.repo.ListTransactions(ctx, userID, page, limit)
	if err != nil {
		return nil, err
	}
	if data == nil {
		data = []model.Transaction{}
	}
	return &model.PaginatedResponse[model.Transaction]{Data: data, Total: total, Page: page, Limit: limit}, nil
}

func (s *financeService) CreateTransaction(ctx context.Context, userID int64, req *model.CreateTransactionRequest) (*model.Transaction, error) {
	if req.AmountCents == 0 {
		return nil, fmt.Errorf("validation: amount_cents must be non-zero")
	}
	if req.Category == "" {
		return nil, fmt.Errorf("validation: category is required")
	}
	if _, err := time.Parse("2006-01-02", req.Date); err != nil {
		return nil, fmt.Errorf("validation: date must be in YYYY-MM-DD format")
	}
	return s.repo.CreateTransaction(ctx, userID, req)
}

func (s *financeService) DeleteTransaction(ctx context.Context, userID, id int64) error {
	return s.repo.DeleteTransaction(ctx, userID, id)
}

func (s *financeService) ListBudgets(ctx context.Context, userID int64, month time.Time) ([]model.Budget, error) {
	data, err := s.repo.ListBudgets(ctx, userID, month)
	if err != nil {
		return nil, err
	}
	if data == nil {
		data = []model.Budget{}
	}
	return data, nil
}

func (s *financeService) UpsertBudget(ctx context.Context, userID int64, req *model.UpsertBudgetRequest) (*model.Budget, error) {
	if req.Category == "" {
		return nil, fmt.Errorf("validation: category is required")
	}
	if req.LimitCents <= 0 {
		return nil, fmt.Errorf("validation: limit_cents must be greater than 0")
	}
	if _, err := time.Parse("2006-01-02", req.Month); err != nil {
		return nil, fmt.Errorf("validation: month must be in YYYY-MM-DD format (first of month)")
	}
	return s.repo.UpsertBudget(ctx, userID, req)
}

func (s *financeService) GetNetWorth(ctx context.Context, userID int64) (*model.NetWorthResponse, error) {
	assets, err := s.repo.ListAssets(ctx, userID)
	if err != nil {
		return nil, err
	}
	liabilities, err := s.repo.ListLiabilities(ctx, userID)
	if err != nil {
		return nil, err
	}
	if assets == nil {
		assets = []model.Asset{}
	}
	if liabilities == nil {
		liabilities = []model.Liability{}
	}

	var total int64
	for _, a := range assets {
		total += a.ValueCents
	}
	for _, l := range liabilities {
		total -= l.ValueCents
	}

	return &model.NetWorthResponse{Assets: assets, Liabilities: liabilities, TotalCents: total}, nil
}

func (s *financeService) UpsertAsset(ctx context.Context, userID int64, req *model.UpsertAssetRequest) (*model.Asset, error) {
	if req.Name == "" {
		return nil, fmt.Errorf("validation: name is required")
	}
	if req.ValueCents < 0 {
		return nil, fmt.Errorf("validation: value_cents must be non-negative")
	}
	return s.repo.UpsertAsset(ctx, userID, req)
}

func (s *financeService) DeleteAsset(ctx context.Context, userID, id int64) error {
	return s.repo.DeleteAsset(ctx, userID, id)
}

func (s *financeService) UpsertLiability(ctx context.Context, userID int64, req *model.UpsertLiabilityRequest) (*model.Liability, error) {
	if req.Name == "" {
		return nil, fmt.Errorf("validation: name is required")
	}
	if req.ValueCents < 0 {
		return nil, fmt.Errorf("validation: value_cents must be non-negative")
	}
	return s.repo.UpsertLiability(ctx, userID, req)
}

func (s *financeService) DeleteLiability(ctx context.Context, userID, id int64) error {
	return s.repo.DeleteLiability(ctx, userID, id)
}

func (s *financeService) ListSubscriptions(ctx context.Context, userID int64) ([]model.Subscription, error) {
	data, err := s.repo.ListSubscriptions(ctx, userID)
	if err != nil {
		return nil, err
	}
	if data == nil {
		data = []model.Subscription{}
	}
	return data, nil
}

func (s *financeService) CreateSubscription(ctx context.Context, userID int64, req *model.CreateSubscriptionRequest) (*model.Subscription, error) {
	if req.Name == "" {
		return nil, fmt.Errorf("validation: name is required")
	}
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("validation: amount_cents must be greater than 0")
	}
	if req.Cycle != "weekly" && req.Cycle != "monthly" && req.Cycle != "yearly" {
		return nil, fmt.Errorf("validation: cycle must be weekly, monthly, or yearly")
	}
	if _, err := time.Parse("2006-01-02", req.NextRenewal); err != nil {
		return nil, fmt.Errorf("validation: next_renewal must be in YYYY-MM-DD format")
	}
	return s.repo.CreateSubscription(ctx, userID, req)
}

func (s *financeService) DeleteSubscription(ctx context.Context, userID, id int64) error {
	return s.repo.DeleteSubscription(ctx, userID, id)
}
