# Hardware & Plywood Shop ERP

A full-stack Enterprise Resource Planning (ERP) system built for hardware and plywood retail businesses. Manages inventory, purchases, sales, GST-compliant invoicing, expenses, payments, staff attendance, and business reports — all from one dashboard.

Built with the **MERN** stack (MongoDB, Express, React, Node.js).

## Features

- **Authentication & Roles** — JWT-based login with Admin / Staff roles and route-level permission guards
- **Dashboard** — today's sales/purchases/profit, low-stock alerts, pending payments, recent activity, charts
- **Inventory** — products with SKU/barcode, category, brand, GST/HSN, stock levels, Excel import/export
- **Categories & Brands** — full CRUD for product classification
- **Suppliers & Customers** — contact info, credit limits, outstanding balances, ledgers
- **Purchases & Sales** — GST-aware invoices (CGST/SGST/IGST) with automatic stock updates
- **GST Invoicing** — printable/PDF invoices with QR code, amount in words, round-off
- **Expenses & Payments** — cash/UPI/bank/cheque tracking, partial/pending payments
- **Reports** — sales, purchase, GST, stock, and profit reports with export
- **Staff Attendance** — gate-pass badges (barcode/QR) for on-site check-in verification
- **Notifications** — low stock, out of stock, pending payments
- **Company Branding** — company name & logo (set from Settings → Company Profile) shown dynamically across the login page, landing page, and sidebar
- **Settings** — company profile, user management, roles & permissions

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Redux Toolkit, Axios, React Hook Form, Recharts

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, Multer, Helmet, express-rate-limit

## Project Structure

```
hardware-plywood-erp/
├── backend/            # Express + MongoDB API
│   └── src/
│       ├── config/         # env, db connection, constants
│       ├── models/         # Mongoose schemas
│       ├── controllers/    # request handlers
│       ├── services/       # business logic
│       ├── routes/         # API routes (mounted under /api/v1)
│       ├── middlewares/    # auth, RBAC, error handling, uploads
│       ├── validators/     # request validation
│       ├── utils/          # helpers (PDF, GST calc, tokens, etc.)
│       └── uploads/        # uploaded files (e.g. company logo)
│
└── frontend/           # React + Vite app
    └── src/
        ├── components/     # reusable UI, forms, charts, invoice UI
        ├── pages/           # route-level pages (dashboard, products, sales, ...)
        ├── layouts/         # sidebar/navbar/auth layouts
        ├── context/         # Auth & Company context providers
        ├── redux/           # Redux Toolkit store & slices
        ├── services/        # Axios API clients, one per resource
        └── routes/          # route definitions & guards
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database — either a local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values (see table below)
npm run seed            # creates the default admin account
npm run dev              # starts the API on http://localhost:5001
```

### 2. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env   # points the app at your backend
npm run dev              # starts the app on http://localhost:5173
```

### Backend environment variables (`backend/.env`)

| Key | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the API listens on |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `7d`) |
| `SKIP_DB` | `true` to run against in-memory demo data instead of MongoDB |

### Frontend environment variables (`frontend/.env`)

| Key | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, e.g. `http://localhost:5001/api/v1` |

## Default Login

Running `npm run seed` creates a protected default admin account that cannot be deleted:

```
```

Change the password after your first login (Settings → User Management).

## Roles & Permissions

- **Admin** — full access: inventory, purchases, sales, expenses, staff, GST, reports, settings, backups
- **Staff** — create sales invoices, view/search products, manage customers; cannot delete products/sales, view profit reports, or change settings

## Deployment

The frontend (static Vite build) and backend (Node API) deploy as two separate services — e.g. Render Static Site + Render Web Service, with MongoDB Atlas as the database. Set `CLIENT_URL` on the backend to the deployed frontend URL, and `VITE_API_BASE_URL` on the frontend to the deployed backend's `/api/v1` URL.

> Uploaded files (e.g. company logo) are stored on local disk — on hosts with an ephemeral filesystem (like Render's free tier), uploads are lost on redeploy unless you move to cloud storage (S3/Cloudinary).
