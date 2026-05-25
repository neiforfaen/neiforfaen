package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/neiforfaen/neiforfaen/apps/api/internal/model"
)

type contextKey string

const claimsContextKey contextKey = "jwt_claims"

func (m *Manager) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			WriteError(w, http.StatusUnauthorized, "authorization header is required")
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
			WriteError(w, http.StatusUnauthorized, "authorization header format must be: Bearer {token}")
			return
		}

		claims, err := m.Validate(parts[1])
		if err != nil {
			WriteError(w, http.StatusUnauthorized, err.Error())
			return
		}

		ctx := context.WithValue(r.Context(), claimsContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ClaimsFromContext(ctx context.Context) *model.Claims {
	claims, _ := ctx.Value(claimsContextKey).(*model.Claims)
	return claims
}

func (m *Manager) RequireRole(role string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims := ClaimsFromContext(r.Context())
		if claims == nil || claims.Role != role {
			WriteError(w, http.StatusForbidden, "you do not have permission to perform this action")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func WriteError(w http.ResponseWriter, status int, message string) {
	WriteJSON(w, status, model.APIError{Code: status, Message: message})
}
