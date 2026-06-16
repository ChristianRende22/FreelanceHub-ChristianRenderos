# FreelanceHub API

**Parcial — Diseño y Desarrollo de APIs | ESEN 2026**
**Estudiante:** Christian Renderos — 202452662

API REST para plataforma de servicios freelance. Desarrollada con NestJS, TypeORM y PostgreSQL.

---

## Stack

- NestJS + TypeScript
- TypeORM + PostgreSQL (Docker)
- JWT + Passport
- Swagger (documentación automática)

---

## Requisitos

- Node.js 18+
- Docker Desktop

---

## Setup

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/ChristianRende22/FreelanceHub-ChristianRenderos.git
cd FreelanceHub-ChristianRenderos
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```
Editar `.env` con tus credenciales si es necesario.

### 3. Levantar base de datos con Docker
```bash
docker compose up -d
```

### 4. Correr el proyecto
```bash
npm run start:dev
```

Al iniciar, se crea automáticamente un usuario seed:
- **Email:** `freelancer@test.com`
- **Password:** `123456`

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/login` | ❌ | Login → retorna JWT |
| GET | `/public/services` | ❌ | Ver servicios disponibles |
| POST | `/services` | ✅ JWT | Crear nuevo servicio |

---

## Swagger

Disponible en: **http://localhost:3000/api**

Para probar rutas protegidas:
1. Hacer login en `POST /auth/login`
2. Copiar el `access_token`
3. Click en **Authorize** → pegar el token

---

## Flujo de prueba

```bash
# 1. Login
POST /auth/login
{ "email": "freelancer@test.com", "password": "123456" }
→ { "access_token": "eyJ..." }

# 2. Crear servicio (con token)
POST /services
Authorization: Bearer <token>
{ "title": "Logo Profesional", "category": "Diseño", "description": "...", "price": 50 }
→ 201 Created

# 3. Ver servicios (sin token)
GET /public/services
→ [{ "title": "...", "category": "...", "price": 50, "provider": "Juan Pérez" }]
```
