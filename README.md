# AWS Three-Tier Web Architecture

![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazon-aws)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

A production-grade **User Management System** deployed on AWS
using Three-Tier Architecture — Presentation, Application, and Data tiers
fully separated across private and public subnets.


## Architecture Diagram
<h2 align="center">AWS Three Tier Web Architecture</h2>

<p align="center">
  <img src="https://raw.githubusercontent.com/Ananthapad77/aws-three-tier-web-architecture/main/Threetierarchitecture.png" width="900">
</p>
## 🏗️ Architecture
# AWS Three-Tier Web Architecture


# AWS Three-Tier Web Architecture

> A production-ready, scalable, and highly available cloud infrastructure on AWS — designed with security, performance, and resilience at its core.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Traffic Flow](#traffic-flow)
- [Architecture Layers](#architecture-layers)
  - [Presentation Tier](#1-presentation-tier-frontend)
  - [Application Tier](#2-application-tier-backend)
  - [Data Tier](#3-data-tier-database--cache)
- [Networking](#networking-architecture)
- [Security](#security-implementation)
- [Technology Stack](#technology-stack)
- [AWS Services](#aws-services-used)
- [Key Benefits](#key-benefits)
- [Monitoring & Observability](#monitoring--observability)
- [Learning Outcomes](#learning-outcomes)
- [Author](#author)

---

## Overview

This project demonstrates a **production-grade AWS Three-Tier Web Architecture** that separates concerns across three logical layers:

| Tier | Layer | Purpose |
|------|-------|---------|
| **1** | Presentation | Frontend — static content, CDN, DNS |
| **2** | Application | Backend — business logic, APIs, auto scaling |
| **3** | Data | Database & cache — storage, replication, performance |

The infrastructure follows AWS Well-Architected Framework principles across all five pillars: **Operational Excellence, Security, Reliability, Performance Efficiency, and Cost Optimization**.

---

## Architecture

```
                        ┌─────────────────────────────────────────────────────┐
                        │                   AWS Cloud (VPC)                   │
                        │                                                     │
  User ──► Route 53 ──► CloudFront ──► WAF ──► S3 (Static)                   │
                               │                                              │
                               └──► Application Load Balancer (Public Subnet) │
                                             │                                │
                               ┌─────────────┼──────────────┐                │
                               ▼             ▼              ▼                 │
                           EC2 (AZ-1)   EC2 (AZ-2)    EC2 (AZ-3)             │
                           [Auto Scaling Group — Private App Subnet]          │
                               │             │              │                 │
                               └─────────────┼──────────────┘                │
                                             │                                │
                         ┌───────────────────┴────────────────────┐          │
                         ▼                                         ▼          │
                  RDS MySQL (Primary)                    ElastiCache Redis     │
                  RDS MySQL (Standby)                   [Private DB Subnet]   │
                  [Multi-AZ — Private DB Subnet]                              │
                        └─────────────────────────────────────────────────────┘
```

---

## Traffic Flow

A complete end-to-end request lifecycle:

```
1.  User opens browser
        │
2.  Route 53 resolves the domain name
        │
3.  Request routed to CloudFront CDN
        │
4.  AWS WAF inspects and filters malicious traffic
        │
5.  Static assets served directly from S3
        │
6.  Dynamic API requests forwarded to Application Load Balancer
        │
7.  ALB distributes requests across EC2 instances (Auto Scaling Group)
        │
8.  Backend servers process business logic
        │
9.  ──► Cache hit?  →  ElastiCache Redis responds immediately
    ──► Cache miss? →  Query Amazon RDS MySQL
        │
10. Response flows back: Backend → ALB → CloudFront → User
```

---

## Architecture Layers

### 1. Presentation Tier (Frontend)

Responsible for delivering the user interface and static content globally with low latency.

| Service | Role |
|---------|------|
| **Amazon S3** | Static website hosting (HTML, CSS, JS, images) |
| **Amazon CloudFront** | Global CDN — caches and accelerates content delivery |
| **Amazon Route 53** | DNS resolution and traffic routing |
| **AWS WAF** | Web Application Firewall — protects against OWASP threats |

**Key Responsibilities:**
- Serve frontend application assets
- Deliver content globally with CDN edge caching
- Filter and block malicious web traffic
- Reduce latency for end users worldwide

---

### 2. Application Tier (Backend)

Handles all business logic, API processing, and dynamic request handling.

| Service | Role |
|---------|------|
| **Application Load Balancer** | Distributes incoming HTTP/HTTPS traffic |
| **Amazon EC2** | Virtual servers running the backend application |
| **Auto Scaling Group** | Automatically adjusts capacity based on demand |
| **AWS Elastic Beanstalk** | Managed deployment for Node.js / Express backend |

**Key Responsibilities:**
- Process API requests and business logic
- Scale horizontally based on traffic patterns
- Distribute load evenly across availability zones
- Maintain high availability during failures

---

### 3. Data Tier (Database & Cache)

Manages persistent data storage, high availability replication, and performance caching.

| Service | Role |
|---------|------|
| **Amazon RDS MySQL** | Relational database with Multi-AZ failover |
| **Amazon ElastiCache Redis** | In-memory caching for frequent queries |
| **AWS Secrets Manager** | Secure storage and rotation of DB credentials |

**Key Responsibilities:**
- Store application data with durability guarantees
- Provide automatic failover with Multi-AZ replication
- Reduce database load with Redis caching layer
- Manage secrets securely — no hardcoded credentials

---

## Networking Architecture

The infrastructure is deployed inside a **custom VPC** with strict subnet isolation:

```
VPC
├── Public Subnets (AZ-1, AZ-2)
│   ├── Internet Gateway
│   ├── NAT Gateway
│   └── Application Load Balancer
│
├── Private App Subnets (AZ-1, AZ-2)
│   ├── EC2 Instances
│   └── Auto Scaling Group
│
└── Private DB Subnets (AZ-1, AZ-2)
    ├── Amazon RDS (Primary + Standby)
    └── Amazon ElastiCache Redis
```

> Databases and backend services are **never publicly accessible**. All outbound internet access from private subnets routes through the NAT Gateway.

---

## Security Implementation

Security is enforced at **every layer** of the architecture:

| Layer | Control | Description |
|-------|---------|-------------|
| **Network** | Security Groups | Fine-grained inbound/outbound traffic rules between tiers |
| **Network** | Private Subnets | Backend and DB resources isolated from public internet |
| **Application** | AWS WAF | Blocks SQL injection, XSS, and other OWASP Top 10 threats |
| **Credentials** | Secrets Manager | Encrypted storage and automatic rotation of DB passwords |
| **Transport** | AWS ACM (HTTPS) | TLS/SSL encryption for all data in transit |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (Amazon RDS) |
| **Cache** | Redis (Amazon ElastiCache) |
| **Infrastructure** | AWS Cloud Services |

---

## AWS Services Used

| Category | Services |
|----------|----------|
| **Networking** | Amazon VPC, Public & Private Subnets, Internet Gateway, NAT Gateway |
| **DNS & CDN** | Amazon Route 53, Amazon CloudFront |
| **Security** | AWS WAF, AWS Secrets Manager, AWS Certificate Manager |
| **Storage** | Amazon S3 |
| **Compute** | Application Load Balancer, Amazon EC2, Auto Scaling Group, AWS Elastic Beanstalk |
| **Database** | Amazon RDS MySQL (Multi-AZ), Amazon ElastiCache Redis |
| **Monitoring** | Amazon CloudWatch |

---

## Key Benefits

### High Availability
Multi-AZ deployment across two or more Availability Zones ensures the application remains resilient to data center failures. RDS automatic failover minimizes downtime.

### Scalability
Auto Scaling Groups dynamically add or remove EC2 instances based on real-time CPU, memory, or custom CloudWatch metrics — handling traffic spikes without manual intervention.

### Security
Private networking ensures databases are unreachable from the internet. WAF actively filters malicious requests. Secrets Manager eliminates hardcoded credentials.

### Performance
CloudFront edge caching reduces origin server load. ElastiCache Redis serves sub-millisecond responses for frequently accessed data, significantly reducing RDS query latency.

### Cost Optimization
AWS managed services follow a pay-as-you-go model. Auto Scaling prevents over-provisioning. CloudFront caching reduces data transfer costs from origin servers.

---

## Monitoring & Observability

| Tool | What It Monitors |
|------|-----------------|
| **Amazon CloudWatch** | Logs, metrics, alarms, and dashboards for all AWS resources |
| **EC2 Health Checks** | Instance-level health; Auto Scaling replaces unhealthy instances |
| **ALB Access Logs** | Request counts, latency, HTTP status codes, target health |
| **RDS Performance Insights** | Query performance, connections, and wait events |
| **CloudFront Metrics** | Cache hit ratio, error rates, origin latency |

---

## Learning Outcomes

This project demonstrates hands-on experience with:

- Designing **cloud-native, multi-tier architectures** on AWS
- Implementing **secure VPC networking** with public/private subnet isolation
- Deploying and managing **Auto Scaling** and **Load Balancing**
- Integrating **CDN, in-memory caching**, and **relational databases**
- Applying **AWS security best practices** at the network, application, and data layers
- Managing **production-grade infrastructure** using AWS managed services

---

## Author

**Ananthapadmanabhan G**
*Cloud / DevOps / AWS Engineer*

---

> *Built with AWS best practices for networking, security, scalability, and observability.*




## Overview
This project demonstrates a Three-Tier Web Architecture on AWS using:
- **CloudFront** - Global CDN & content delivery
- **Application Load Balancer** - HTTP traffic routing
- **Elastic Beanstalk** - Auto-scaling application tier
- **RDS MySQL** - Managed relational database
- **ElastiCache Redis** - Caching & session management
- **Route 53** - DNS service
- **CloudWatch** - Monitoring & logs
- **SNS** - Notifications
- **NAT Gateway** - Outbound internet access
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
