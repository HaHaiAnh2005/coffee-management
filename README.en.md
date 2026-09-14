# ☕ Smart Online Coffee Shop & Warehouse Management System

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)

[**Tiếng Việt**](README.md) | [**English**](README.en.md)

> **Coffee Management System** is an all-in-one, modern enterprise solution designed for coffee shops and beverage chains operating an **Online-First Delivery & Takeaway Model**. It seamlessly integrates a **Customer Ordering Portal**, an **Online Orders Management Hub**, an **Administrative Management Hub with Raw Material & Warehouse In/Out Vouchers**, and a smart **AI Virtual Assistant powered by Google Gemini**.

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
   - [Customer Portal](#1-customer-portal)
   - [Online Orders Processing](#2-online-orders-processing)
   - [Administrative Portal](#3-administrative-portal)
   - [Google Gemini AI Virtual Assistant](#4-google-gemini-ai-virtual-assistant)
3. [Tech Stack](#-tech-stack)
4. [Directory Structure](#-directory-structure)
5. [Installation & Getting Started](#-installation--getting-started)
6. [Demo Accounts & RBAC](#-demo-accounts--rbac)
7. [Available Scripts](#-available-scripts)
8. [Future Roadmap](#-future-roadmap)
9. [License](#-license)

---

## 📖 Project Overview

The system is architected as a streamlined **Fullstack Monorepo**:
- **Backend (Express + MongoDB)** and **Frontend (React + Vite)** run concurrently on a single port (`5173`) using **Vite Middleware Mode** (or can be decoupled independently).
- Features a responsive, smooth, and modern UI tailored for desktop computers, tablets, and smartphones.
- Automatically seeds rich mock data (categories, products, staff accounts, customers, raw materials, warehouse receipts, store settings) upon initial launch.

---

## ✨ Key Features

### 1. Customer Portal
- **Landing & Brand Storytelling**: Engaging homepage showcasing brand stories, seasonal specials, events, and ambiance.
- **Online Beverage Catalog**:
  - Categorized menu (Milk Tea, Cloud Foam, Coffee, Fruit Tea, Snacks...).
  - Instant search and price filters.
  - Item customizer: Size selection, sugar percentage, ice level, and extra toppings.
- **Shopping Cart & Checkout**:
  - Persistent real-time cart state.
  - Flexible payment options: Cash on Delivery (COD), Banking Transfer via Dynamic QR code, VNPay & MoMo redirect gateways.
- **Loyalty & Membership Program**:
  - Customer registration, login, and profile management.
  - Points accumulation based on invoice amounts.
  - Tiered membership: **Bronze**, **Silver**, **Gold**, **Diamond** with progressive discounts.
  - Detailed order history and live order tracking.

---

### 2. Online Orders Processing
- **Order Dispatching & Fulfillment**: Real-time handling of online customer orders (Delivery & Takeaway).
- **Multi-Gateway Payment Support**: Cash on Delivery (COD), VietQR instant bank transfer, and redirect gateways for MoMo & VNPay.
- **Order Status Pipeline**: Seamless lifecycle tracking from `Pending` -> `Confirmed` -> `Delivering` -> `Completed` / `Cancelled`.

---

### 3. Administrative Portal
- **Analytics Dashboard**:
  - Real-time revenue insights by day, week, and month.
  - Order volume, guest counts, and best-selling item leaderboards.
- **Menu & Category Management**:
  - Full CRUD operations for drinks, categories, images, pricing, and descriptions.
  - Instant stock availability toggle (In Stock / Out of Stock).
- **Material Inventory & Receipt Management (Stock In / Stock Out Vouchers)**:
  - Material catalog tracking: SKUs, cost prices, suppliers, units of measurement (kg, liter, box, pack, bag).
  - **Stock In Receipt (PNK)**: Import ingredients from suppliers with unit cost and quantity, automatically incrementing stock.
  - **Stock Out Receipt (PXK)**: Issue raw materials to brewing/kitchen counters, automatically validating and deducting available stock balances.
  - **Professional Printable Voucher Preview**: Styled with 88 BỒNG BIÊNG header, voucher metadata, line items table, VND summary, and 3 formal signature fields (Creator, Deliverer/Receiver, Store Manager).
- **Staff & Role-Based Access Control (RBAC)**:
  - Granular permissions for roles: `ADMIN`, `MANAGER`, `CASHIER`, `BARISTA`, `WAITER`.
  - Override PIN management for supervisors.
- **Customer CRM & Loyalty**:
  - View member list, reward points, lifetime spend, and auto-tier evaluations.
- **Promotion & Coupon Engine**:
  - Percentage-based or fixed discounts, usage caps, and expiration date settings.
- **Reports & Excel Export**:
  - Financial, order, and sales analysis reports.
  - Export data to `.xlsx` spreadsheets for bookkeeping.
- **Audit Logs**:
  - Comprehensive logging of sensitive operational events for accountability.
- **Store Settings**:
  - Configurable receipt header/footer, VAT rate, point exchange rates, and store contact info.

---

### 4. Google Gemini AI Virtual Assistant
- Integrated with **Google Gemini 2.0** utilizing **Function / Tool Calling**:
  - Recommends beverages based on personalized dietary preferences (sweet, refreshing, low calorie, creamy).
  - Real-time check for vacant tables across zones.
  - Inquires about current promotion campaigns and vouchers.
  - Answers branch locations, operating hours, and brand history.

---

## 🛠 Tech Stack

### Frontend
- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router Dom v7](https://reactrouter.com/)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs/)
- **Data Fetching & Caching**: [TanStack Query v5](https://tanstack.com/query)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons & Date**: [React Icons](https://react-icons.github.io/react-icons/), [Day.js](https://day.js.org/)
- **Spreadsheet Export**: [SheetJS (XLSX)](https://sheetjs.com/)

### Backend
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) (via `tsx`)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Token) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **AI Engine**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini Flash API)

---

## 📂 Directory Structure

```
coffee-management/
├── backend/                  # Backend source code (Express REST API)
│   ├── config/               # Database connection setup
│   ├── controllers/          # API business logic controllers
│   ├── middleware/           # JWT authentication, RBAC authorization
│   ├── models/               # Mongoose Schemas (User, Product, Order, Shift...)
│   ├── routes/               # API route definitions
│   ├── seed/                 # Database initial seeder
│   ├── services/             # Core services & Google Gemini AI integration
│   ├── app.ts                # Express setup & Vite Middleware integration
│   └── server.ts             # Server entrypoint
│
├── frontend/                 # Frontend source code (React + Vite)
│   ├── src/
│   │   ├── api/              # Axios instance & API requests
│   │   ├── components/       # Reusable components (Modals, Navbar, Sidebar, Receipts...)
│   │   ├── layouts/          # Layout wrappers: MainLayout, AdminLayout, AuthLayout
│   │   ├── pages/
│   │   │   ├── admin/        # Admin pages (Dashboard, Inventory, Orders, Products, Staff...)
│   │   │   └── client/       # Client pages (Home, Menu, Cart, Profile, Story...)
│   │   ├── routes/           # Routing configuration & guards (Private, Admin)
│   │   ├── stores/           # Zustand global state (Auth, Cart, Inventory...)
│   │   ├── types/            # TypeScript interfaces & types
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # React DOM entry
│   └── index.html            # Client HTML entry
│
├── .env                      # Environment configurations (MongoDB, JWT, Gemini key)
├── package.json              # Project dependencies and script declarations
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Documentation (Vietnamese)
└── README.en.md              # Documentation (English)
```

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (**v18+** or v20/v22 recommended).
- **MongoDB** instance running locally (`mongodb://localhost:27017`) or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

### 2. Install Dependencies
Open a terminal in the project root directory (`coffee-management`):
```bash
npm install
```

### 3. Environment Configuration (`.env`)
Create or verify the `.env` file in the root folder:
```env
# Application Port
PORT=5173

# MongoDB Connection URI
MONGODB_URI=mongodb://127.0.0.1:27017/coffee-management

# Environment Mode
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=coffee_management_super_secret_jwt_key_2026
JWT_EXPIRES_IN=1d

# (Optional) Google Gemini AI API Key for Chatbot
# Obtain a free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
Run the single command below to launch both the backend and frontend:
```bash
npm run dev
```

The system will:
1. Connect to MongoDB.
2. Automatically verify and seed initial demo data if the database is empty.
3. Serve the application at:
   - 🌐 **Web Application**: [http://localhost:5173/](http://localhost:5173/)
   - ⚡ **Backend API Endpoints**: [http://localhost:5173/api/](http://localhost:5173/api/)

---

## 🔑 Demo Accounts & RBAC

The database seeder provisions the following accounts:

### 1. Staff & Management Accounts
Sign in at: `http://localhost:5173/admin/login`

| Role | Login Email | Password | Override PIN | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Store Owner (ADMIN)** | `admin@lauracoffee.vn` | `123456` | `9999` | Full system access, financials, settings, user roles |
| **Manager (MANAGER)** | `manager@lauracoffee.vn` | `123456` | `1234` | Manage menu, staff shifts, approve manager overrides |
| **Cashier (CASHIER)** | `cashier@lauracoffee.vn` | `123456` | — | Process online delivery/takeaway orders, customer service |
| **Barista (BARISTA)** | `barista@lauracoffee.vn` | `123456` | — | Kitchen Display System (KDS), drink preparation status |
| **Server (WAITER)** | `waiter@lauracoffee.vn` | `123456` | — | Customer service, order fulfillment |

### 2. Demo Customer Accounts
Sign in at: `http://localhost:5173/login`

| Customer Name | Phone Number | Membership Tier | Points |
| :--- | :--- | :--- | :--- |
| **Nguyen Thi Mai** | `0901234567` | 💎 **Diamond** | 1,250 pts |
| **Tran Van Nam** | `0902345678` | 🥇 **Gold** | 650 pts |
| **Le Hoang Yen** | `0903456789` | 🥈 **Silver** | 280 pts |
| **Pham Quoc Anh** | `0904567890` | 🥉 **Bronze** | 50 pts |

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Fullstack dev server (Express + Vite Middleware) |
| `npm run dev:frontend` | Runs Vite frontend separately |
| `npm run dev:backend` | Runs Express backend with `tsx watch` separately |
| `npm run build` | Validates TypeScript types and builds the production frontend |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks across the codebase |

---

## 💡 Future Roadmap
- [ ] Automated payment gateway integration (MoMo, VNPay, ZaloPay, Dynamic VietQR).
- [ ] Thermal receipt printing via Web Bluetooth / ESC/POS network printers.
- [ ] Real-time order dispatch notifications with WebSockets / Socket.io.
- [ ] Customer QR code self-ordering mobile app.

---

## 📝 License

Distributed for educational, research, and smart F&B solution deployment purposes.  
Enjoy building and brewing! ☕✨
