package main

import (
    "context"
    "fmt"
    "log/slog"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/joho/godotenv"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/auth"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/config"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/database"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/handler"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/middleware"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/repository"
    "github.com/neiforfaen/neiforfaen/apps/api/internal/service"
)

func main() {
    // 1. Load env and initialize structured JSON logger
    _ = godotenv.Load()
    logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
    slog.SetDefault(logger)

    // 2. Load typed configuration (fails fast on missing env vars)
    cfg, err := config.Load()
    if err != nil {
        logger.Error("failed to load configuration", "error", err)
        os.Exit(1)
    }

    // 3. Initialize the PostgreSQL connection pool
    pool, err := database.NewPool(context.Background(), cfg.Database.DSN)
    if err != nil {
        logger.Error("failed to connect to database", "error", err)
        os.Exit(1)
    }
    defer pool.Close()

    // 4. Wire dependencies (Dependency Injection, manually)
    jwtManager := auth.NewManager(cfg.JWT.Secret, cfg.JWT.ExpiryHours)

    userRepo := repository.NewUserRepository(pool)

    authSvc := service.NewAuthService(userRepo, jwtManager)

    authHandler := handler.NewAuthHandler(authSvc)

    financeRepo    := repository.NewFinanceRepository(pool)
    financeSvc     := service.NewFinanceService(financeRepo)
    financeHandler := handler.NewFinanceHandler(financeSvc)

    // 5. Register routes using the Go 1.22+ enhanced ServeMux
    mux := http.NewServeMux()

    // Public routes
    mux.HandleFunc("POST /api/v1/auth/register", authHandler.Register)
    mux.HandleFunc("POST /api/v1/auth/login", authHandler.Login)

    // Finance routes (protected)
    mux.Handle("GET /api/v1/finance/transactions",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.ListTransactions)))
    mux.Handle("POST /api/v1/finance/transactions",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.CreateTransaction)))
    mux.Handle("DELETE /api/v1/finance/transactions/{id}",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.DeleteTransaction)))

    mux.Handle("GET /api/v1/finance/budgets",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.ListBudgets)))
    mux.Handle("POST /api/v1/finance/budgets",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.UpsertBudget)))

    mux.Handle("GET /api/v1/finance/net-worth",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.GetNetWorth)))
    mux.Handle("POST /api/v1/finance/net-worth/assets",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.UpsertAsset)))
    mux.Handle("DELETE /api/v1/finance/net-worth/assets/{id}",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.DeleteAsset)))
    mux.Handle("POST /api/v1/finance/net-worth/liabilities",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.UpsertLiability)))
    mux.Handle("DELETE /api/v1/finance/net-worth/liabilities/{id}",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.DeleteLiability)))

    mux.Handle("GET /api/v1/finance/subscriptions",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.ListSubscriptions)))
    mux.Handle("POST /api/v1/finance/subscriptions",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.CreateSubscription)))
    mux.Handle("DELETE /api/v1/finance/subscriptions/{id}",
        jwtManager.Middleware(http.HandlerFunc(financeHandler.DeleteSubscription)))

    // 6. Apply global middleware (outermost = last to execute for the request, first for the response)
    loggedMux := middleware.Logger(logger)(mux)

    // 7. Configure the server with strict timeouts — essential for production
    server := &http.Server{
        Addr:         fmt.Sprintf(":%s", cfg.Server.Port),
        Handler:      loggedMux,
        ReadTimeout:  time.Duration(cfg.Server.ReadTimeoutSec) * time.Second,
        WriteTimeout: time.Duration(cfg.Server.WriteTimeoutSec) * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    // 8. Start server in a goroutine and listen for OS shutdown signals
    go func() {
        logger.Info("server starting", "port", cfg.Server.Port)
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Error("server failed to start", "error", err)
            os.Exit(1)
        }
    }()

    // Block until we receive SIGINT or SIGTERM (e.g., from `docker stop` or Ctrl+C)
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    // 9. Graceful shutdown: give in-flight requests 30 seconds to complete
    logger.Info("server shutting down gracefully...")
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := server.Shutdown(ctx); err != nil {
        logger.Error("server forced to shut down", "error", err)
    }
    logger.Info("server stopped")
}
