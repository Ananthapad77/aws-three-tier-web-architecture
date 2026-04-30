# AWS Three-Tier Web Architecture

![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazon-aws)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

A production-grade **User Management System** deployed on AWS
using Three-Tier Architecture — Presentation, Application, and Data tiers
fully separated across private and public subnets.

## 🌐 Live Demo
**URL:** http://d29tkwjze0pcvw.cloudfront.net

## 🏗️ Architecture
## ☁️ AWS Services Used

| Service | Purpose |
|---|---|
| CloudFront | CDN, two behaviors — static + API proxy |
| S3 | React build hosting with OAC |
| Elastic Beanstalk | Managed Node.js deployment |
| ALB | Application Load Balancer |
| Auto Scaling | Min 2, Max 6 EC2 instances |
| RDS MySQL 8.0 | Managed database, Multi-AZ |
| ElastiCache Redis | Session and query caching |
| VPC | Custom network, 6 subnets, 2 AZs |
| IAM | Least-privilege EC2 role |
| CloudWatch | Metrics, alarms, logs |
| SNS | Email alert notifications |

## 🔒 Security

- Database in private subnet — not accessible from internet
- Security groups: sg-alb → sg-app → sg-rds chain
- Block public access ON for S3
- IAM least-privilege EC2 instance profile
- No hardcoded credentials

## ✨ Features

- View, Add, Edit, Delete users
- Search by name or email
- Filter by role (Admin / Editor / Viewer)
- Filter by status (Active / Inactive)
- Pagination (10 per page)
- Export users as CSV (Excel-ready)
- Dashboard with stats
- REST API with proper HTTP status codes

## 🛠️ Tech Stack

**Frontend:** React 18, CSS3
**Backend:** Node.js 22, Express 4, mysql2
**Database:** MySQL 8.0
**Cloud:** AWS (14 services)

## 🚀 Local Setup

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm start     # runs on :8080

# Frontend
cd frontend
npm install
npm start     # runs on :3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| GET | /api/users | List users |
| GET | /api/users/stats | Statistics |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| GET | /api/users/export/csv | Download CSV |

## 👤 Author

**G. Ananthapadmanabhan**
Site Reliability Engineer · 2.5 years experience
