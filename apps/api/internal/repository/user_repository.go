package repository

import (
    "context"
    "errors"
    "fmt"

    "github.com/jackc/pgx/v5"
    "github.com/jackc/pgx/v5/pgxpool"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/model"
)

// UserRepository defines the contract for User data access.
type UserRepository interface {
    Create(ctx context.Context, email, hashedPassword string) (*model.User, error)
    FindByEmail(ctx context.Context, email string) (*model.User, error)
    FindByID(ctx context.Context, id int64) (*model.User, error)
}

type pgUserRepository struct {
    pool *pgxpool.Pool
}

// NewUserRepository creates a new PostgreSQL-backed UserRepository.
func NewUserRepository(pool *pgxpool.Pool) UserRepository {
    return &pgUserRepository{pool: pool}
}

func (r *pgUserRepository) Create(ctx context.Context, email, hashedPassword string) (*model.User, error) {
    query := `
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id, email, role, created_at`

    var user model.User
    err := r.pool.QueryRow(ctx, query, email, hashedPassword).Scan(
        &user.ID, &user.Email, &user.Role, &user.CreatedAt,
    )
    if err != nil {
        return nil, fmt.Errorf("userRepo.Create: %w", err)
    }
    return &user, nil
}

func (r *pgUserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
    query := `SELECT id, email, password, role, created_at FROM users WHERE email = $1`

    var user model.User
    err := r.pool.QueryRow(ctx, query, email).Scan(
        &user.ID, &user.Email, &user.Password, &user.Role, &user.CreatedAt,
    )
    if err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return nil, nil // Not found is not an error at this layer
        }
        return nil, fmt.Errorf("userRepo.FindByEmail: %w", err)
    }
    return &user, nil
}

func (r *pgUserRepository) FindByID(ctx context.Context, id int64) (*model.User, error) {
    query := `SELECT id, email, role, created_at FROM users WHERE id = $1`

    var user model.User
    err := r.pool.QueryRow(ctx, query, id).Scan(
        &user.ID, &user.Email, &user.Role, &user.CreatedAt,
    )
    if err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return nil, nil
        }
        return nil, fmt.Errorf("userRepo.FindByID: %w", err)
    }
    return &user, nil
}
