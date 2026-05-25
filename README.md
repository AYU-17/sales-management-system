# 📊 Sales Management System

A full-stack **Sales Management System** built with React + Node.js + MySQL, featuring role-based access for Admins and Sales Executives.

## ✨ Features

- 🔐 JWT-based authentication (Admin & Executive roles)
- 📦 Order management with multi-step approval workflow
- 💰 Payment tracking (cash/online, partial/full)
- 📍 Area and vendor management
- 📈 Commission calculation per executive
- 🎯 Sales target tracking
- 👥 Executive onboarding and management

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL 8.x (hosted on Railway) |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **File Uploads** | Multer + Cloudinary |
| **Email** | Nodemailer (SMTP) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.x (local or Railway cloud)

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_/sales-management-system.git](https://github.com/AYU-17/sales-management-system.git)
cd sales-management-system
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Setup Database

Create a MySQL database named `sales_management`, then import the SQL files in `server/sql/` **in this exact order**:

```
admins.sql → areas.sql → products.sql → executives.sql → vendors.sql →
executive_areas.sql → executive_targets.sql → executive_commissions.sql →
orders.sql → order_items.sql → payments.sql
```

Then seed initial data:
```bash
node run_seed.js
```

### 4. Setup Frontend
```bash
cd client
npm install
npm run dev
```

App runs at → **http://localhost:5173**

## 🔑 Demo Login Credentials

| Role | Contact Number | Password |
|------|-------|----------|
| **Super Admin** | 9999999999 | Admin@123 |
| **Executive** | 9876543210 | Executive@123 |

## 📁 Project Structure

```
Sales Management System/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
├── server/               # Node.js backend
│   ├── sql/              # Database schema & seed files
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   ├── .env.example      # Environment variable template
│   └── run_seed.js       # Database seeder utility
└── .gitignore
```

## ⚙️ Environment Variables

Copy `server/.env.example` to `server/.env` and fill in your values:

```env
PORT=5000
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sales_management
JWT_SECRET=your_strong_secret_here
CLIENT_URL=http://localhost:5173
```

## 📄 License

MIT License — feel free to use and modify.
