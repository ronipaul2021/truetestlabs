# TrueTestLabs 🔬

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20React%20%7C%20Expo%20%7C%20Express%20%7C%20Prisma-blue)](https://github.com/ronipaul2021/truetestlabs)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![Database: SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey.svg)](https://sqlite.org)

TrueTestLabs is a comprehensive clinical diagnostic and operations management platform. Built as a monorepo, it seamlessly integrates administrative control, clinical portals, client ordering systems, and mobile companion applications to manage laboratory operations.

---

## 🏗️ Repository Architecture

This codebase is structured as a monorepo containing the following components:

| Directory | Component | Technology Stack | Default Port / Environment |
| :--- | :--- | :--- | :--- |
| [**`/backend`**](./backend) | Express API & Prisma Service Layer | Node.js, Express, Prisma, SQLite, TypeScript | Port `3000` |
| [**`/portal`**](./portal) | Clinical Order Portal (Clients & Doctors) | Next.js (v16), React 19, Tailwind CSS (v4) | Port `3002` |
| [**`/admin`**](./admin) | Platform Management Dashboard | Next.js (v16), React 19, Tailwind CSS (v4) | Port `3000` (auto-falls back to `3001` if busy) |
| [**`/mobile`**](./mobile) | Patient/Physician Companion Mobile App | Expo, React Native, TypeScript | Expo Development Server |

---

## 🚀 Getting Started

Follow the steps below to set up and run the TrueTestLabs platform locally.

### 📋 Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.x or later recommended)
- **npm** (v9.x or later) or **yarn** / **pnpm**

---

### 1. Backend Setup

The backend manages the central SQLite database and provides API routes for the frontend applications.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Configure local database (Prisma migrations & seed data)
npx prisma migrate dev --name init
npm run seed  # Optional: seed initial dummy data

# Start the backend server in development mode
npm run dev
```

The server will start running at `http://localhost:3000`.

---

### 2. Client Portal Setup

The portal handles diagnostics ordering, test lists, and status updates for clinicians and patients.

```bash
# Navigate to the portal directory
cd ../portal

# Install dependencies
npm install

# Start the portal in development mode
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser to view the client portal.

---

### 3. Admin Dashboard Setup

The admin dashboard handles lab operational flows, staff management, and system-wide settings.

```bash
# Navigate to the admin directory
cd ../admin

# Install dependencies
npm install

# Start the admin portal in development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in the terminal output) in your browser.

---

### 4. Mobile Application Setup

The mobile application is a React Native app built using Expo.

```bash
# Navigate to the mobile directory
cd ../mobile

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Use the **Expo Go** application on your physical device (iOS or Android) or run it inside an emulator/simulator as prompted by the CLI.

---

## 🔒 Environment Configurations

For security, local configurations are stored in environment files. Do not commit `.env` files to the repository.

### Backend Environment Variables (`/backend/.env`)
Create a `.env` file in the `/backend` folder with the following contents:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_key"
PORT=3000
```

---

## 🤝 Contributing

1. Create a descriptive feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'feat: add some amazing feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request.
