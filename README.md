# 🍽️ BITES — Restaurant Management System

A full-stack restaurant management system with eSewa payment integration for Nepal.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Payment Integration](#-payment-integration)
- [Admin Dashboard](#-admin-dashboard)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

BITES is a comprehensive restaurant management system built for the Nepali market. It provides a seamless experience for customers to browse menus, place orders, and make payments using eSewa — Nepal's leading digital wallet. The platform also includes a full admin dashboard for restaurant management.

**Key highlights:**

- 🇳🇵 Built specifically for Nepal, with eSewa integration
- 💳 Secure online payments
- 📱 Fully responsive design
- 👑 Complete admin dashboard
- ⭐ Customer review & rating system

## ✨ Features

### 🏠 Customer Features

| Feature              | Description                                   |
| -------------------- | --------------------------------------------- |
| 🔐 Authentication    | JWT-based login/register with role management |
| 🍽️ Menu Browsing     | Search, filter by category, and price range   |
| 🛒 Shopping Cart     | Add/remove items, update quantities           |
| 💳 eSewa Payment     | Secure payment via Nepal's leading wallet     |
| 📦 Order Tracking    | Real-time order status updates                |
| 📋 My Orders         | View order history and details                |
| ⭐ Reviews & Ratings | Rate dishes after delivery                    |
| 👤 User Profile      | Manage personal information                   |
| 📅 Reservations      | Book tables online                            |
| 📱 Responsive        | Works on all devices                          |

### 👑 Admin Features

| Feature              | Description                          |
| -------------------- | ------------------------------------ |
| 📊 Dashboard         | Overview of sales, orders, and users |
| 📦 Order Management  | Update order status, view all orders |
| 🍽️ Menu Management   | CRUD operations for menu items       |
| 👥 User Management   | Manage users and assign roles        |
| 📅 Reservations      | Handle table bookings                |
| ⭐ Review Moderation | Approve/reject customer reviews      |
| 💳 Payment Tracking  | View all transactions                |

## 🛠️ Tech Stack

**Frontend**

- React 18 — UI library
- Vite — build tool
- Tailwind CSS — styling
- React Router v6 — navigation
- Framer Motion — animations
- Axios — HTTP client
- Lucide React — icons

**Backend**

- Node.js — runtime
- Express.js — web framework
- MongoDB — database
- Mongoose — ODM
- JWT — authentication
- bcryptjs — password hashing
- Nodemailer — email service

**Payment Integration**

- eSewa — Nepal's digital wallet

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      │
│  │  User   │   │  Menu   │   │  Cart   │   │  Admin  │      │
│  │  Pages  │   │  Pages  │   │  Pages  │   │  Pages  │      │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘      │
└────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Axios)                         │
└────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                        │
│  ┌─────────┐   ┌─────────────┐   ┌─────────┐   ┌──────────┐ │
│  │ Routes  │ → │ Controllers │ → │ Models  │ → │Middleware│ │
│  └─────────┘   └─────────────┘   └─────────┘   └──────────┘ │
└────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                         │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      │
│  │  Users  │   │ Orders  │   │  Menu   │   │ Reviews │      │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Kabita01-web/Bites.git
cd Bites
```

### 2. Backend setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your values
```

### 3. Frontend setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Update .env with your API URL
```

### 4. Run the application

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

### 5. Access the application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🔐 Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bites

# JWT
JWT_SECRET=your_jwt_secret_key

# eSewa Configuration (Test)
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_GATEWAY_URL=https://uat.esewa.com.np/api/epay/main/v2/form
ESEWA_SUCCESS_URL=http://localhost:5000/api/payments/esewa-success
ESEWA_FAILURE_URL=http://localhost:5000/api/payments/esewa-failure

# Frontend URLs
CLIENT_URL=http://localhost:5173
PAYMENT_SUCCESS_REDIRECT=http://localhost:5173/payment/success
PAYMENT_FAILURE_REDIRECT=http://localhost:5173/payment/failure

# Currency
CURRENCY=NPR
```

> ⚠️ The eSewa credentials above are the **public UAT (sandbox) test credentials** provided by eSewa for developers — not a secret specific to this project. Swap these for real merchant credentials before accepting live payments, and never commit production keys to the repo.

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 💳 Payment Integration

### eSewa Integration

BITES uses eSewa as the primary payment gateway for Nepal.

**Test credentials (sandbox)**

```
Product Code: EPAYTEST
Secret Key:   8gBm/:&EnhH.1/q
Test Card:    4242 4242 4242 4242
```

**Payment flow**

1. User checks out
2. Backend creates order and generates a merchant ID
3. Frontend redirects to the eSewa payment page
4. User completes payment
5. eSewa redirects back to the success/failure URL
6. Backend verifies the payment
7. Order status is updated

## 👑 Admin Dashboard

Access the admin dashboard at `/dashboard`.

### Roles

| Role      | Permissions                |
| --------- | -------------------------- |
| Admin     | Full access — all features |
| Moderator | Manage orders and menu     |
| User      | Customer features only     |

### Dashboard features

- 📊 **Overview** — sales, orders, and user stats
- 📦 **Orders** — view and update order status
- 🍽️ **Menu** — add, edit, delete items
- 👥 **Users** — manage user accounts and roles
- 📅 **Reservations** — handle table bookings
- ⭐ **Reviews** — moderate customer reviews
- 💳 **Payments** — view transaction history

## 📁 Project Structure

```
bites/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── context/              # React Context (Auth, Cart)
│   │   ├── pages/                 # All pages
│   │   │   ├── auth/               # Login, Register
│   │   │   ├── customer/           # Home, Menu, Checkout
│   │   │   ├── dashboard/          # Admin pages
│   │   │   ├── info/               # About, Contact
│   │   │   └── user/               # Profile
│   │   ├── services/              # API calls
│   │   ├── App.jsx                 # Main app
│   │   └── main.jsx                 # Entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/              # Business logic
│   ├── models/                    # Database models
│   ├── routes/                    # API routes
│   ├── middleware/                # Auth, validation
│   ├── utils/                      # Helpers
│   ├── app.js                       # Main server
│   └── package.json
│
└── README.md
```

## 🚀 Deployment

### Deploy backend (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repo
5. Set build command: `npm install`
6. Set start command: `node app.js`
7. Add environment variables
8. Deploy

### Deploy frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Build the app
cd frontend
npm run build

# Deploy
vercel --prod
```

## 📸 Screenshots

| Home Page                             | Menu Page                               |
| ------------------------------------- | --------------------------------------- |
| ![Home Page]("./screenshot/home.jpg") | ![Menu Page](.".\screenshot\home.jpeg") |

| Checkout                                | Admin Dashboard                                 |
| --------------------------------------- | ----------------------------------------------- |
| ![Checkout](./screenshots/checkout.png) | ![Admin Dashboard](./screenshots/dashboard.png) |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

## 👨‍💻 Author

**Kabita Bhurtel**

- GitHub: [@Kabita01-web](https://github.com/Kabita01-web)

## 🙏 Acknowledgments

- [eSewa](https://esewa.com.np) for the payment gateway
- [React](https://react.dev) for the UI library
- [Tailwind CSS](https://tailwindcss.com) for styling
- [MongoDB](https://www.mongodb.com) for the database

## ⭐ Support

If you found this project helpful, please give it a ⭐ on GitHub!
