-- Migration 002: Soporte para inicio de sesión con Google
-- Conserva el sistema de roles existente (client / receptionist / admin):
-- solo agrega la columna google_id y permite cuentas sin contraseña local.

-- 1) password_hash deja de ser obligatorio (usuarios solo-Google no tienen contraseña)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 2) Identificador estable de la cuenta de Google (claim "sub" del id_token)
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);

-- 3) Un mismo google_id no puede pertenecer a dos usuarios
CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_key ON users (google_id);
