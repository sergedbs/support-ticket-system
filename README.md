# Support Ticket System

Lightweight full-stack MVP for managing support tickets with demo role-based access control.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Express.js, Prisma, SQLite, JWT, Swagger UI
- Deployment targets: Vercel for frontend, Render for backend

## Main Flows

- Select a demo role and receive a short-lived token.
- View protected dashboard and ticket pages.
- Create, edit, delete, search, filter, and upvote tickets.
- Agents can view and update all tickets.
- Admins have full ticket access and an admin-only page.

## Roles

- Visitor: public page, theme switching, demo role selection
- User: create and manage own tickets
- Agent: view and update all tickets
- Admin: full ticket access

## Run Frontend

```sh
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://127.0.0.1:5173
```

Optional frontend environment variable:

```txt
VITE_API_URL=http://127.0.0.1:4000
```

## Run Backend

```sh
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run db:push
npm run db:seed
npm start
```

Backend URL:

```txt
http://127.0.0.1:4000
```

If you open the frontend at `http://127.0.0.1:5173`, keep that origin in `backend/.env`:

```txt
FRONTEND_URL="http://localhost:5173,http://127.0.0.1:5173"
```

Swagger UI:

```txt
http://127.0.0.1:4000/docs
```

## API

- `POST /token`
- `GET /tickets`
- `GET /tickets/:id`
- `POST /tickets`
- `PATCH /tickets/:id`
- `DELETE /tickets/:id`
- `POST /tickets/:id/vote`
- `GET /docs`

## Checks

Frontend:

```sh
cd frontend
npm run build
```

Backend:

```sh
cd backend
npm run prisma:generate
npx prisma validate
node --check src/server.js
node --check src/routes/tickets.js
node --check src/routes/token.js
```

## Live Demo

Frontend: <https://support-ticket-system-ashy-five.vercel.app>

Backend: <https://support-ticket-system-w0ej.onrender.com>

Swagger: <https://support-ticket-system-w0ej.onrender.com/docs>

Uptime status: <https://stats.uptimerobot.com/38qPT0oHXk>

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
