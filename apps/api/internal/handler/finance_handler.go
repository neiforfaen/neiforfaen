package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/neiforfaen/neiforfaen/apps/api/internal/auth"
	"github.com/neiforfaen/neiforfaen/apps/api/internal/model"
	"github.com/neiforfaen/neiforfaen/apps/api/internal/service"
)

type FinanceHandler struct {
	svc service.FinanceService
}

func NewFinanceHandler(svc service.FinanceService) *FinanceHandler {
	return &FinanceHandler{svc: svc}
}

// --- Transactions ---

func (h *FinanceHandler) ListTransactions(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	resp, err := h.svc.ListTransactions(r.Context(), claims.UserID, page, limit)
	if err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to list transactions")
		return
	}
	auth.WriteJSON(w, http.StatusOK, resp)
}

func (h *FinanceHandler) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	var req model.CreateTransactionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	t, err := h.svc.CreateTransaction(r.Context(), claims.UserID, &req)
	if err != nil {
		if strings.HasPrefix(err.Error(), "validation:") {
			auth.WriteError(w, http.StatusUnprocessableEntity, err.Error())
			return
		}
		auth.WriteError(w, http.StatusInternalServerError, "failed to create transaction")
		return
	}
	auth.WriteJSON(w, http.StatusCreated, t)
}

func (h *FinanceHandler) DeleteTransaction(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.DeleteTransaction(r.Context(), claims.UserID, id); err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to delete transaction")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- Budgets ---

func (h *FinanceHandler) ListBudgets(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	monthStr := r.URL.Query().Get("month")
	if monthStr == "" {
		now := time.Now()
		monthStr = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC).Format("2006-01-02")
	}
	month, err := time.Parse("2006-01-02", monthStr)
	if err != nil {
		auth.WriteError(w, http.StatusBadRequest, "month must be YYYY-MM-DD")
		return
	}
	budgets, err := h.svc.ListBudgets(r.Context(), claims.UserID, month)
	if err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to list budgets")
		return
	}
	auth.WriteJSON(w, http.StatusOK, budgets)
}

func (h *FinanceHandler) UpsertBudget(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	var req model.UpsertBudgetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	b, err := h.svc.UpsertBudget(r.Context(), claims.UserID, &req)
	if err != nil {
		if strings.HasPrefix(err.Error(), "validation:") {
			auth.WriteError(w, http.StatusUnprocessableEntity, err.Error())
			return
		}
		auth.WriteError(w, http.StatusInternalServerError, "failed to upsert budget")
		return
	}
	auth.WriteJSON(w, http.StatusOK, b)
}

// --- Net worth ---

func (h *FinanceHandler) GetNetWorth(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	nw, err := h.svc.GetNetWorth(r.Context(), claims.UserID)
	if err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to get net worth")
		return
	}
	auth.WriteJSON(w, http.StatusOK, nw)
}

func (h *FinanceHandler) UpsertAsset(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	var req model.UpsertAssetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	a, err := h.svc.UpsertAsset(r.Context(), claims.UserID, &req)
	if err != nil {
		if strings.HasPrefix(err.Error(), "validation:") {
			auth.WriteError(w, http.StatusUnprocessableEntity, err.Error())
			return
		}
		auth.WriteError(w, http.StatusInternalServerError, "failed to upsert asset")
		return
	}
	auth.WriteJSON(w, http.StatusCreated, a)
}

func (h *FinanceHandler) DeleteAsset(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.DeleteAsset(r.Context(), claims.UserID, id); err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to delete asset")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *FinanceHandler) UpsertLiability(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	var req model.UpsertLiabilityRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	l, err := h.svc.UpsertLiability(r.Context(), claims.UserID, &req)
	if err != nil {
		if strings.HasPrefix(err.Error(), "validation:") {
			auth.WriteError(w, http.StatusUnprocessableEntity, err.Error())
			return
		}
		auth.WriteError(w, http.StatusInternalServerError, "failed to upsert liability")
		return
	}
	auth.WriteJSON(w, http.StatusCreated, l)
}

func (h *FinanceHandler) DeleteLiability(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.DeleteLiability(r.Context(), claims.UserID, id); err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to delete liability")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- Subscriptions ---

func (h *FinanceHandler) ListSubscriptions(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	subs, err := h.svc.ListSubscriptions(r.Context(), claims.UserID)
	if err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to list subscriptions")
		return
	}
	auth.WriteJSON(w, http.StatusOK, subs)
}

func (h *FinanceHandler) CreateSubscription(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	var req model.CreateSubscriptionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	s, err := h.svc.CreateSubscription(r.Context(), claims.UserID, &req)
	if err != nil {
		if strings.HasPrefix(err.Error(), "validation:") {
			auth.WriteError(w, http.StatusUnprocessableEntity, err.Error())
			return
		}
		auth.WriteError(w, http.StatusInternalServerError, "failed to create subscription")
		return
	}
	auth.WriteJSON(w, http.StatusCreated, s)
}

func (h *FinanceHandler) DeleteSubscription(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		auth.WriteError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.DeleteSubscription(r.Context(), claims.UserID, id); err != nil {
		auth.WriteError(w, http.StatusInternalServerError, "failed to delete subscription")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
