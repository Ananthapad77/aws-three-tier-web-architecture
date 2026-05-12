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


AWS Three-Tier Web Architecture on AWS

This project demonstrates a production-ready AWS Three-Tier Web Architecture designed to be scalable, secure, and highly available. The architecture separates the application into three logical layers:

Presentation Tier (Frontend)
Application Tier (Backend)
Data Tier (Database & Cache)

The infrastructure follows AWS best practices for networking, security, scalability, and monitoring.

Architecture Diagram

Architecture Overview

The system is deployed inside an AWS Virtual Private Cloud (VPC) with public and private subnets across multiple Availability Zones for high availability.

The architecture includes:

Secure networking
Load balancing
Auto scaling
CDN acceleration
Database replication
Caching layer
Monitoring and logging
Traffic Flow (End-to-End)
Users access the application through a web browser.
Amazon Route 53 resolves the domain name.
Traffic is routed to Amazon CloudFront CDN.
AWS WAF protects the application from common web threats.
Static frontend content is delivered from Amazon S3.
Dynamic API requests are forwarded to the Application Load Balancer (ALB).
The ALB distributes requests to EC2 instances running in an Auto Scaling Group.
Backend application servers process requests.
Data is retrieved from Amazon RDS MySQL database.
Frequently accessed data is cached using Amazon ElastiCache Redis.
The response flows back through ALB → CloudFront → User.
Architecture Layers
1. Presentation Tier (Frontend)

Handles the user interface and static content delivery.

Services Used
Amazon S3 (Static Website Hosting)
Amazon CloudFront (CDN)
Amazon Route 53 (DNS)
AWS WAF
Responsibilities
Serve frontend application (HTML, CSS, JS, images)
Deliver content globally using CDN caching
Protect application from web threats
Reduce latency for users
2. Application Tier (Backend)

Handles business logic and API processing.

Services Used
Application Load Balancer
Amazon EC2
Auto Scaling Group
AWS Elastic Beanstalk (Node.js / Express backend)
Responsibilities
Process application requests
Run backend services
Scale automatically based on traffic
Distribute traffic across multiple instances
3. Data Tier (Database)

Handles data storage and caching.

Services Used
Amazon RDS MySQL (Multi-AZ)
Amazon ElastiCache Redis
AWS Secrets Manager
Responsibilities
Store application data securely
Provide high availability with Multi-AZ replication
Improve performance using caching
Secure database credentials using Secrets Manager
Networking Architecture

The infrastructure is deployed inside a custom VPC.

Public Subnets
NAT Gateway
Application Load Balancer
Internet access
Private App Subnets
EC2 instances
Auto Scaling Group
Backend application servers
Private DB Subnets
Amazon RDS
Amazon ElastiCache

This design ensures that databases and backend services are not publicly accessible.

Security Implementation

Security is implemented at multiple layers.

Network Security
Security Groups controlling traffic between tiers
Private subnets for backend and database
Application Security
AWS WAF protecting CloudFront
Credential Management
AWS Secrets Manager stores database credentials
Encryption
HTTPS via AWS Certificate Manager
AWS Services Used
Amazon VPC
Public & Private Subnets
Internet Gateway
NAT Gateway
Amazon Route 53
Amazon CloudFront
AWS WAF
Amazon S3
Application Load Balancer
Amazon EC2
Auto Scaling Group
AWS Elastic Beanstalk
Amazon RDS MySQL
Amazon ElastiCache Redis
AWS Secrets Manager
AWS Certificate Manager
Amazon CloudWatch
Key Benefits of This Architecture
High Availability

Multi-AZ deployment ensures application resilience.

Scalability

Auto Scaling adjusts capacity automatically.

Security

Private networking, WAF protection, and Secrets Manager.

Performance

CloudFront CDN and Redis caching reduce latency.

Cost Optimization

Pay-as-you-go AWS managed services.

Monitoring & Observability

Monitoring is implemented using:

Amazon CloudWatch for logs and metrics
Health checks for EC2 instances
Load balancer monitoring
Application performance metrics
Technology Stack

Frontend

React.js

Backend

Node.js
Express.js

Database

MySQL (Amazon RDS)

Caching

Redis (Amazon ElastiCache)

Infrastructure

AWS Cloud Services
Project Learning Outcomes

This project demonstrates practical experience in:

Designing cloud-native architectures
Implementing secure AWS networking
Deploying scalable applications
Using Auto Scaling and Load Balancing
Integrating CDN, caching, and databases
Managing production-grade infrastructure
Author

Ananthapadmanabhan G

Cloud / DevOps / AWS Engineer



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
