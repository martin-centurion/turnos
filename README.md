# Turnos - Reservas

## Backend (Supabase + Resend)

La app usa una Function de Vercel en `api/reservations.js` para guardar reservas y enviar un email al admin.

### 1) Crear tabla en Supabase

En el SQL Editor de Supabase:

```sql
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  whatsapp text not null,
  service text not null,
  service_id text,
  date date not null,
  time text not null,
  status text not null default 'pending',
  reservation_id text not null
);

create index if not exists reservations_date_idx on reservations (date);
```

### 2) Variables de entorno

Copiá `.env.example` a `.env` en local y configurá las mismas variables en Vercel.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `ADMIN_EMAIL`

Notas:
- `SUPABASE_SERVICE_ROLE_KEY` es privada (no la expongas en el frontend).
- `RESEND_FROM` debe ser un dominio verificado en Resend (ej: `Reservas <no-reply@tudominio.com>`).
- `ADMIN_EMAIL` es el mail que recibe la notificación.

### 3) Desarrollo local

Opciones:

1) Usar Vercel Functions en local:
   - `vercel dev`

2) Usar modo local sin backend:
   - `VITE_USE_LOCAL_STORAGE=true` y luego `npm run dev`

## Endpoints

- `GET /api/reservations` lista todas las reservas.
- `POST /api/reservations` crea una reserva y envía mail al admin.
- `PATCH /api/reservations` actualiza estado/fecha/horario.
