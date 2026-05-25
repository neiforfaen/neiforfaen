package service

import (
    "context"
    "fmt"
    "strings"

    "golang.org/x/crypto/bcrypt"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/auth"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/model"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/repository"
)

// AuthService defines the contract for authentication business logic.
type AuthService interface {
    Register(ctx context.Context, req *model.RegisterRequest) (*model.AuthResponse, error)
    Login(ctx context.Context, req *model.LoginRequest) (*model.AuthResponse, error)
}

type authService struct {
    userRepo   repository.UserRepository
    jwtManager *auth.Manager
}

// NewAuthService creates a new AuthService.
func NewAuthService(userRepo repository.UserRepository, jwtManager *auth.Manager) AuthService {
    return &authService{userRepo: userRepo, jwtManager: jwtManager}
}

func (s *authService) Register(ctx context.Context, req *model.RegisterRequest) (*model.AuthResponse, error) {
    // --- Validation ---
    req.Email = strings.TrimSpace(strings.ToLower(req.Email))
    if req.Email == "" || !strings.Contains(req.Email, "@") {
        return nil, fmt.Errorf("validation: a valid email address is required")
    }
    if len(req.Password) < 8 {
        return nil, fmt.Errorf("validation: password must be at least 8 characters long")
    }

    // --- Check for existing user ---
    existing, err := s.userRepo.FindByEmail(ctx, req.Email)
    if err != nil {
        return nil, fmt.Errorf("register: failed to check existing user: %w", err)
    }
    if existing != nil {
        return nil, fmt.Errorf("validation: a user with this email already exists")
    }

    // --- Hash the password using bcrypt at cost 12 ---
    // Cost 12 is the modern recommendation: secure enough, not so slow it impacts UX.
    hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
    if err != nil {
        return nil, fmt.Errorf("register: failed to hash password: %w", err)
    }

    user, err := s.userRepo.Create(ctx, req.Email, string(hash))
    if err != nil {
        return nil, fmt.Errorf("register: failed to create user: %w", err)
    }

    token, err := s.jwtManager.Generate(user.ID, user.Email, user.Role)
    if err != nil {
        return nil, err
    }

    return &model.AuthResponse{
        AccessToken: token,
        TokenType:   "Bearer",
        User:        user,
    }, nil
}

func (s *authService) Login(ctx context.Context, req *model.LoginRequest) (*model.AuthResponse, error) {
    req.Email = strings.TrimSpace(strings.ToLower(req.Email))

    user, err := s.userRepo.FindByEmail(ctx, req.Email)
    if err != nil {
        return nil, fmt.Errorf("login: database error: %w", err)
    }

    // IMPORTANT: Return the same generic error for both "user not found" and
    // "wrong password" to prevent user enumeration attacks.
    if user == nil {
        return nil, fmt.Errorf("auth: invalid email or password")
    }
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        return nil, fmt.Errorf("auth: invalid email or password")
    }

    token, err := s.jwtManager.Generate(user.ID, user.Email, user.Role)
    if err != nil {
        return nil, err
    }

    return &model.AuthResponse{
        AccessToken: token,
        TokenType:   "Bearer",
        User:        user,
    }, nil
}
