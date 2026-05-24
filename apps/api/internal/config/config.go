package config

import (
	"fmt"
	"os"
	"strconv"
)

type Confi struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
}

type ServerConfig struct {
	Port            int
	ReadTimeoutSec  int
	WriteTimeoutSec int
}

type DatabaseConfig struct {
	DSN string
}

type JWTConfig struct {
	Secret    	 string
	ExpirationMs int
}

func LoadConfig() (*Config, error) {
	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		return nil, fmt.Errorf("JWT_SECRET_KEY environment variable is required")
	}

	dbDSN := os.Getenv("DATABASE_URL")
	if dbDSN == "" {
		return nil, fmt.Errorf("DATABASE_URL environment variable is required")
	}

	readTimeout, _ := strconv.Atoi(os.Getenv("SERVER_READ_TIMEOUT_SEC"))
	if readTimeout == 0 {
		readTimeout = 10
	}

	writeTimeout, _ := strconv.Atoi(os.Getenv("SERVER_WRITE_TIMEOUT_SEC"))
	if writeTimeout == 0 {
		writeTimeout = 10
	}

	jwtExpiry, _ := strconv.Atoi(os.Getenv("JWT_EXPIRATION_MS"))
	if jwtExpiry == 0 {
		jwtExpiry = 3_600_000 // Default to 1 hour
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		Server: ServerConfig{
			Port:            port,
			ReadTimeoutSec:  readTimeout,
			WriteTimeoutSec: writeTimeout,
		},
		Database: DatabaseConfig{
			DSN: dbDSN,
		},
		JWT: JWTConfig{
			Secret:    secret,
			ExpirationMs: jwtExpiry,
		},
	}, nil
}
