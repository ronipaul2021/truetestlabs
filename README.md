<div align="center">
  <img src="ttl-final.png" alt="TrueTestLabs Logo" width="120" />

  # TrueTestLabs 
  ### **Next-Generation B2B Platform for Diagnostic Centers**

  [![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20React%2019%20%7C%20Tailwind%20v4%20%7C%20Express%20%7C%20Prisma-10B981?style=for-the-badge)](https://github.com/ronipaul2021/truetestlabs)
  [![Project Status: Active Development](https://img.shields.io/badge/Status-Under_Development-F59E0B?style=for-the-badge)](https://github.com/ronipaul2021/truetestlabs)
  [![License: ISC](https://img.shields.io/badge/License-ISC-6366F1?style=for-the-badge)](https://opensource.org/licenses/ISC)

  *Empowering laboratories with real-time patient flow, automated report delivery, and streamlined operations.*
</div>

---

> [!WARNING]
> **🚧 UNDER ACTIVE DEVELOPMENT 🚧**
> 
> This project is currently a **Work In Progress (WIP)**. The platform is continuously receiving major updates to enhance the B2B and B2C experience. APIs, database schemas, and UI components are subject to breaking changes without notice.

---

## ⚡ Overview

**TrueTestLabs** is a premium, monorepo-based clinical diagnostic and operations management platform. Engineered for scale, it provides diagnostic centers with a powerful, beautiful, and secure workstation to manage everything from service catalogs and patient orders to staff permissions and revenue analytics.

---

## ✨ Key Features

- 🏥 **Multi-Step Partner Onboarding:** Secure registration flow for diagnostic centers capturing ISO/NABL compliance and emergency capabilities.
- 📊 **Real-Time Analytics Dashboard:** Live revenue tracking, patient flow metrics, and AI-powered trend analysis.
- 🧬 **Deep Service Deep Analysis:** Exhaustive catalog management including TAT (Turnaround Time), parameters, clinical symptoms, and geofenced home collection.
- 📦 **Kanban Logistics Hub:** Drag-and-drop order tracking, automated barcode generation, and specimen logistics.
- 👥 **Team & Role Management:** Granular RBAC (Role-Based Access Control) for laboratory staff (Phlebotomists, Pathologists, Admins).
- ⚙️ **Control Center:** Global policy configurations, SLA monitoring, and security audit logs.
- 🎨 **Premium Aesthetic UI:** Glassmorphism, animated elements, and a meticulously crafted "Midnight Navy" theme for a world-class SaaS experience.

---

## 🏗️ Repository Architecture

This codebase is structured as a monorepo containing interconnected services:

| Component | Directory | Technology Stack | Default Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API** | [`/backend`](./backend) | Node.js, Express, Prisma, SQLite | `3000` | Core REST API, business logic, and database layer. |
| **Partner Portal** | [`/portal`](./portal) | Next.js (v16), React 19, Tailwind CSS | `3001` | The main workstation and dashboard for Diagnostic Centers. |
| **Admin Panel** | [`/admin`](./admin) | Next.js, React, Tailwind CSS | `3002` | Super-admin dashboard for TrueTestLabs platform management. |
| **Mobile App** | [`/mobile`](./mobile) | Expo, React Native, TypeScript | `8081` | Companion application for patients and phlebotomists. |

---

## 🚀 Getting Started

Follow these instructions to set up the TrueTestLabs platform on your local development environment.

### Prerequisites

- **Node.js** (v18.x or later)
- **npm** (v9.x or later)

### 1. Backend Service Setup

The backend handles all data persistence and API endpoints.

```bash
cd backend
npm install

# Initialize SQLite database and run Prisma migrations
npx prisma migrate dev --name init

# Start the Express server
npm run dev
```
*API available at `http://localhost:3000`*

### 2. Partner Portal (Diagnostic Dashboard)

The core web application for diagnostic partners.

```bash
cd ../portal
npm install

# Start the Next.js development server
npm run dev
```
*Portal available at `http://localhost:3001`*

### 3. Environment Configuration

For local development, create a `.env` file in the `/backend` directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_development_jwt_secret_key"
PORT=3000
```

---

## 🤝 Contributing

We welcome contributions to make TrueTestLabs even better.

1. Create a descriptive feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes using Conventional Commits: `git commit -m 'feat(portal): add intelligent barcode scanner'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request for review.

---

<div align="center">
  <p>Built with ❤️ by TrueTestLabs</p>
  <p><b>Secure • Fast • Compliant</b></p>
</div>
