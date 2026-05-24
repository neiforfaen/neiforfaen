package database

import (
    "context"
    "fmt"

    "github.com/jackc/pgx/v5/pgxpool"
)

// NewPool creates and validates a new pgx connection pool.
func NewPool(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
    poolConfig, err := pgxpool.ParseConfig(dsn)
    if err != nil {
        return nil, fmt.Errorf("database: failed to parse DSN: %w", err)
    }

    // Production-ready pool configuration
    poolConfig.MaxConns = 25
    poolConfig.MinConns = 5

    pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
    if err != nil {
        return nil, fmt.Errorf("database: failed to create connection pool: %w", err)
    }

    // Validate connection on startup
    if err := pool.Ping(ctx); err != nil {
        return nil, fmt.Errorf("database: failed to ping postgres: %w", err)
    }

    return pool, nil
}
