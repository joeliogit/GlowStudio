-- Seed: usuarios de prueba (uno por rol) para desarrollo / evaluación.
-- Se ejecuta solo en la primera inicialización de la base de datos.
-- Contraseñas (hash bcrypt, 12 rounds):
--   admin@glowstudio.com      → Admin123      (rol admin)
--   recepcion@glowstudio.com  → Recepcion123  (rol receptionist)
--   cliente@test.com          → Cliente123    (rol client)

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Administrador GlowStudio', 'admin@glowstudio.com',     '$2a$12$WpI4xZB.tj0dhAOoVNEE5ueV56l8lzhGO4nfhueZJanRNvjRP.Q9i', 'admin'),
  ('Recepción GlowStudio',     'recepcion@glowstudio.com', '$2a$12$R.G54umQKvzEAmqa7w0wx..x4kYPMz6dzEwP/GaaOk3ad1kw4xjZ2', 'receptionist'),
  ('Cliente de Prueba',        'cliente@test.com',         '$2a$12$PIprQVDXzIp5PoEH1jkLG.3NTUM3KxYlAQ7E8x7WuyYDQcrn66P4G', 'client')
ON CONFLICT (email) DO NOTHING;
