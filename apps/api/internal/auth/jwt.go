package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/neiforfaen/neiforfaen/apps/api/internal/model"
)

type jwtCustomClaims struct {
	model.Claims
	jwt.RegisteredClaims
}

type Manager struct {
	secretKey   []byte
	expiryHours int64
}

func NewManager(secret string, expiryHours int64) *Manager {
	return &Manager{
		secretKey:   []byte(secret),
		expiryHours: expiryHours,
	}
}

func (m *Manager) Generate(userID int64, email, role string) (string, error) {
	claims := jwtCustomClaims{
		Claims: model.Claims{
			UserID: userID,
			Email:  email,
			Role:   role,
		},
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(m.expiryHours) * time.Hour)),
		IssuedAt: jwt.NewNumericDate(time.Now()),
		Issuer:   "nff-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(m.secretKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return signedToken, nil
}

func (m *Manager) Validate(tokenStr string) (*model.Claims, error) {
    token, err := jwt.ParseWithClaims(tokenStr, &jwtCustomClaims{}, func(token *jwt.Token) (any, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return m.secretKey, nil
    })
    if err != nil {
        if errors.Is(err, jwt.ErrTokenExpired) {
            return nil, fmt.Errorf("token has expired")
        }
        return nil, fmt.Errorf("invalid token: %w", err)
    }

    claims, ok := token.Claims.(*jwtCustomClaims)
    if !ok || !token.Valid {
        return nil, fmt.Errorf("token claims are invalid")
    }

    return &claims.Claims, nil
}
