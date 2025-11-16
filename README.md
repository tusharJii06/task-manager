# Quick Start Summary
## 1. Start Postgres
```bash
docker compose up -d
```

## 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev   # http://localhost:4000
```

## 3. Frontend
```bash
cd ../web
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:4000" > .env.local
npm run dev   # http://localhost:3000
```

### Open http://localhost:3000, register a user, log in, and you’re ready to manage tasks.
