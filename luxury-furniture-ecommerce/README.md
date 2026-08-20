# Luxury Furniture E-commerce Platform

A complete e-commerce solution for luxury furniture including frontend store, backend API, admin panel, and delivery order management.

## Project Structure

```
luxury-furniture-ecommerce/
├── database/
│   └── schema.sql              # MySQL database schema
├── backend/
│   ├── config/
│   │   └── database.js         # Database connection
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── password.js         # Password hashing
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── products.js         # Product CRUD
│   │   ├── cart.js             # Shopping cart
│   │   ├── orders.js           # Order management
│   │   └── admin.js            # Admin & delivery routes
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── ProductCard.js
│   │   │   └── ProductCard.css
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   └── Home.css
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── admin/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js              # Admin panel with dashboard
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Features

### Customer Frontend
- ✅ Responsive home page with hero section
- ✅ Product catalog with filtering
- ✅ Shopping cart management
- ✅ User authentication (login/register)
- ✅ Order placement and tracking
- ✅ Wishlist functionality
- ✅ Product reviews

### Admin Panel
- ✅ Dashboard with statistics
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Customer management
- ✅ **Delivery Management System**
  - Assign deliveries to personnel
  - Track delivery status
  - Update delivery progress
- ✅ Sales analytics

### Backend API
- ✅ RESTful API with Express.js
- ✅ JWT authentication
- ✅ MySQL database integration
- ✅ Role-based access control
- ✅ Payment processing (Stripe ready)
- ✅ Email notifications
- ✅ File upload support

### Database (MySQL)
- ✅ Users (customers, admins, delivery)
- ✅ Products & Categories
- ✅ Orders & Order Items
- ✅ **Delivery Assignments**
- ✅ Cart & Wishlist
- ✅ Reviews
- ✅ Coupons
- ✅ Order Status History

## Installation

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Admin Panel Setup
```bash
cd admin
npm install
npm start
```

## Environment Variables

Create `.env` files based on `.env.example`:

**Backend:**
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET
- STRIPE_SECRET_KEY
- EMAIL credentials

**Frontend/Admin:**
- REACT_APP_API_URL=http://localhost:5000/api

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### Products
- GET `/api/products` - List all products
- GET `/api/products/:id` - Get product details
- POST `/api/products` - Create product (admin)
- PUT `/api/products/:id` - Update product (admin)
- DELETE `/api/products/:id` - Delete product (admin)

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart/items` - Add to cart
- PUT `/api/cart/items/:id` - Update quantity
- DELETE `/api/cart/items/:id` - Remove from cart

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my-orders` - Get user orders
- GET `/api/orders/:id` - Get order details

### Admin
- GET `/api/admin` - List all orders
- PUT `/api/admin/:id/status` - Update order status
- POST `/api/admin/:id/delivery-assign` - Assign delivery
- GET `/api/admin/deliveries/my` - Get delivery assignments
- PUT `/api/admin/deliveries/:id/status` - Update delivery status
- GET `/api/admin/stats/dashboard` - Dashboard statistics

## Technology Stack

- **Frontend:** React 18, React Router, Axios, React Icons
- **Backend:** Node.js, Express.js, MySQL2, JWT, Bcrypt
- **Database:** MySQL
- **Admin:** React with custom dashboard
- **Styling:** CSS3 with responsive design

## Default Admin Credentials

After running the schema:
- Email: admin@luxuryfurniture.com
- Password: (set via registration or update hash in DB)

## License

MIT
