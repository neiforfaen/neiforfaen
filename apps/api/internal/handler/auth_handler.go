package handler

import (
    "encoding/json"
    "net/http"
    "strings"

    "github.com/neiforfaen/neiforfaen/apps/api/internal/auth"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/model"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/service"
)

// AuthHandler handles auth-related HTTP requests.
type AuthHandler struct {
    authSvc service.AuthService
}

// NewAuthHandler creates a new AuthHandler.
func NewAuthHandler(authSvc service.AuthService) *AuthHandler {
    return &AuthHandler{authSvc: authSvc}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
    var req model.RegisterRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        auth.WriteError(w, http.StatusBadRequest, "invalid request body: "+err.Error())
        return
    }

    resp, err := h.authSvc.Register(r.Context(), &req)
    if err != nil {
        if isValidationErr(err) {
            auth.WriteError(w, http.StatusUnprocessableEntity, err.Error())
            return
        }
        auth.WriteError(w, http.StatusInternalServerError, "registration failed")
        return
    }

    auth.WriteJSON(w, http.StatusCreated, resp)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
    var req model.LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        auth.WriteError(w, http.StatusBadRequest, "invalid request body: "+err.Error())
        return
    }

    resp, err := h.authSvc.Login(r.Context(), &req)
    if err != nil {
        auth.WriteError(w, http.StatusUnauthorized, err.Error())
        return
    }

    auth.WriteJSON(w, http.StatusOK, resp)
}

// isValidationErr checks if the error originated from a validation rule.
func isValidationErr(err error) bool {
    return strings.HasPrefix(err.Error(), "validation:")
}
