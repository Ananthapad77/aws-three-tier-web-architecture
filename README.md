# AWS Three-Tier Web Architecture — User Management App

A full-stack web application demonstrating the AWS Three-Tier Architecture pattern.

```
Presentation Tier → React + S3 + CloudFront
Application Tier  → Node.js Express + Elastic Beanstalk + ALB
Data Tier         → MySQL + RDS + ElastiCache
```

---

## Project Structure

```
three-tier-app/
├── frontend/         ← React App (Presentation Tier)
└── backend/          ← Node.js Express API (Application Tier)
```

---

## Prerequisites

Make sure you have installed:
- Node.js 18+  →  https://nodejs.org
- MySQL 8.0+   →  https://dev.mysql.com/downloads/
- VS Code      →  https://code.visualstudio.com
- AWS CLI      →  https://aws.amazon.com/cli/

---

## Run Locally in VS Code

### Step 1 — Set up the database (MySQL)

Open MySQL Workbench or run in terminal:

```sql
CREATE DATABASE appdb CHARACTER SET utf8mb4;
```

The app auto-creates the `users` table on first startup — no manual schema needed.

---

### Step 2 — Start the Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set DB_USER, DB_PASSWORD, DB_NAME to match your MySQL
npm run dev
```

Backend runs at: http://localhost:8080
Health check:    http://localhost:8080/health

Test API:
```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/users/stats
```

---

### Step 3 — Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

The `"proxy": "http://localhost:8080"` in frontend/package.json
automatically forwards /api/* calls to the backend.

---

## API Endpoints

| Method | URL                      | Description               |
|--------|--------------------------|---------------------------|
| GET    | /health                  | Health check (Beanstalk)  |
| GET    | /api/users               | List users (with filters) |
| GET    | /api/users/stats         | User statistics           |
| GET    | /api/users/:id           | Get single user           |
| POST   | /api/users               | Create user               |
| PUT    | /api/users/:id           | Update user               |
| DELETE | /api/users/:id           | Delete user               |

Query parameters for GET /api/users:
- search=<string>   (searches name and email)
- role=admin|editor|viewer
- status=active|inactive
- page=1&limit=10

---

## Deploy to AWS (Manual Console)

Follow the setup guide document for full step-by-step AWS console instructions.

### Backend → Elastic Beanstalk

```bash
cd backend
zip -r ../app.zip . -x '*.git*' -x 'node_modules/*'
# Upload app.zip via Beanstalk console
```

Set these environment variables in Beanstalk console:
```
NODE_ENV    = production
PORT        = 8080
DB_HOST     = <your-rds-endpoint>
DB_USER     = admin
DB_PASSWORD = <from Secrets Manager>
DB_NAME     = appdb
FRONTEND_URL= https://your-cloudfront-domain.cloudfront.net
```

### Frontend → S3 + CloudFront

```bash
cd frontend
npm run build
aws s3 sync ./build s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths '/*'
```

---

## VS Code Extensions Recommended

- ESLint
- Prettier
- MySQL (by cweijan)
- REST Client (to test APIs from .http files)
- AWS Toolkit

---

## Architecture Notes

- `/api/*` requests → CloudFront forwards to ALB → Beanstalk EC2
- Static assets → CloudFront serves from S3 (OAC, never public)
- Database → only reachable from app security group (private subnet)
- Secrets → stored in AWS Secrets Manager, fetched at runtime
