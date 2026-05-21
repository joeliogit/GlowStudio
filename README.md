# GlowStudio

Sistema de gestión para salón de belleza. Reservas de citas, tienda de productos, pagos con Stripe y recordatorios automáticos vía WhatsApp y correo.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TailwindCSS + React Query |
| Backend | Node.js + Express + JWT |
| Base de datos | PostgreSQL 15 |
| Infraestructura | Docker Compose |
| Pagos | Stripe |
| Notificaciones | Twilio · n8n · Nodemailer |
| Imágenes | Cloudinary |

## Estructura

```
glowstudio/
├── client/          # React (Vite)
├── server/          # Express API
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── models/
│       ├── services/
│       ├── jobs/         # Cron de recordatorios
│       └── config/
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
└── docker-compose.yml
```

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `client` | Reservar citas, tienda, historial de citas |
| `receptionist` | Gestión de citas, validación de pagos, inventario |
| `admin` | Dashboard completo + todo lo anterior |

## Puesta en marcha

### 1. Variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con los valores reales:

```env
# Requeridos
DATABASE_URL=postgresql://usuario:password@localhost:5432/glowstudio
JWT_SECRET=tu_secreto_super_seguro

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# n8n (webhook para WhatsApp)
N8N_WEBHOOK_URL=https://...

# Correo
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu@email.com
EMAIL_PASS=tu_contraseña_app

# Cloudinary (imágenes)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google Sign-In (OPCIONAL) — pega el MISMO OAuth Client ID en ambas.
# Si quedan vacías, el botón de Google no aparece y el login por
# contraseña funciona igual.
GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=
```

### 2. Levantar con Docker

```bash
docker compose up -d
```

Esto inicia tres servicios:
- `glowstudio_db` — PostgreSQL en el puerto `5432`
- `glowstudio_backend` — API Express en el puerto `5000`
- `glowstudio_frontend` — React en el puerto `3000`

La base de datos se inicializa automáticamente con el schema y los seeds al primer arranque.

Abrir **http://localhost:3000** en el navegador.

### Credenciales de prueba

Se crean automáticamente al inicializar la base de datos (seed `seed_users.sql`):

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | `admin@glowstudio.com` | `Admin123` |
| Recepcionista | `recepcion@glowstudio.com` | `Recepcion123` |
| Cliente | `cliente@test.com` | `Cliente123` |

El registro público (`/register`) solo crea cuentas de tipo `client`. Tras el login, cada rol se redirige a su panel: cliente → `/`, recepcionista → `/reception`, admin → `/admin`.

### Login con Google (opcional)

Para habilitar "Iniciar sesión con Google":

1. Crear un **OAuth 2.0 Client ID** (tipo *Web application*) en [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Agregar `http://localhost:3000` en **Authorized JavaScript origins**.
3. Pegar el mismo Client ID en `.env` (`GOOGLE_CLIENT_ID` y `VITE_GOOGLE_CLIENT_ID`) y reiniciar: `docker compose up -d`.

Al entrar con Google: si el email **ya existe** se inicia sesión **con su rol actual** (cliente/recepcionista/admin); si es nuevo, se crea como `client`.

### 3. Desarrollo local (sin Docker)

**Backend:**
```bash
cd server
npm install
npm run dev        # nodemon, puerto 5000
```

**Frontend:**
```bash
cd client
npm install
npm run dev        # Vite, puerto 5173
```

## API

Base URL: `http://localhost:5000/api`

| Prefijo | Descripción |
|---------|-------------|
| `POST /auth/register` | Registro de usuario |
| `POST /auth/login` | Login → JWT |
| `POST /auth/google` | Login con Google (verifica el id_token) → JWT |
| `GET /bookings` | Citas del usuario autenticado |
| `POST /bookings` | Crear cita |
| `GET /stylists` | Listado de estilistas |
| `GET /services` | Catálogo de servicios |
| `GET /products` | Catálogo de productos |
| `POST /payments/create-intent` | Crear PaymentIntent de Stripe |
| `POST /payments/webhook` | Webhook de Stripe (cuerpo crudo) |
| `GET /health` | Estado del servidor |

Límite de peticiones: 200 req / 15 min (general) · 20 req / 15 min (auth).

## Recordatorios automáticos

Un cron job corre todos los días a las **10:00 AM** (hora Ciudad de México).  
Busca citas confirmadas del día siguiente con `reminder_sent = false` y envía:

1. **WhatsApp** vía Twilio + webhook de n8n
2. **Correo** vía Nodemailer

Tras el envío marca `reminder_sent = true` en la cita.

## Base de datos

Tablas principales: `users`, `stylists`, `services`, `bookings`, `products`, `orders`, `notifications_log`.

Las migraciones están en `database/migrations/` (numeradas `001_`…`007_`).  
Los seeds en `database/seeds/` cargan usuarios de prueba (un rol c/u), estilistas, servicios y productos de ejemplo.

Con Docker, ambos se aplican automáticamente en el primer arranque.

## Pagos

El flujo con Stripe es:

1. Cliente llama a `POST /api/payments/create-intent` → recibe `client_secret`
2. Frontend confirma el pago con Stripe Elements
3. Stripe notifica al webhook `POST /api/payments/webhook`
4. El backend actualiza `payment_status = 'paid'` en la cita correspondiente

Para pruebas locales usar la CLI de Stripe:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
