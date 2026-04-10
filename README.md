# 🛒 E-Commerce Web Application

🚀 A modern full-stack E-Commerce platform that delivers a seamless online shopping experience with secure payments, dynamic product management, and responsive UI.

---

## ✨ Features

🔐 User Authentication (Login / Register)
🛍️ Product Listing & Categories
🛒 Add to Cart & Order Management
💳 Secure Payment Integration (Razorpay)
📊 Admin Dashboard for Product & User Control
📱 Fully Responsive Design

---

## 🧠 Tech Stack

💻 Frontend: React.js, HTML, CSS, JavaScript
⚙️ Backend: Node.js, Express.js
🗄️ Database: MongoDB
🔑 Authentication: JWT (JSON Web Token)
💰 Payment Gateway: Razorpay

---

## 📂 Project Structure

E-Commerce/
│
├── backend/
│   ├── config/
│   │   └── db.js   → Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── addressController.js
│   │
│   ├── model/
│   │   ├── User.js
│   │   ├── product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Address.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoute.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── addressRoutes.js
│   │
│   ├── .env                  → Environment variables
│   ├── package.json
│   ├── package-lock.json
│   └── server.js             → Entry point
│
├── 🎨 frontend/
│   ├── public/
│   ├── node_modules/
│   ├── 📁 src/
│   │   ├── api/              
│   │   ├── admin/            → Admin panel
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── CheckoutAddress.jsx
│   │   │   └── OrderSuccess.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── .gitignore

---

## ⚙️ Installation & Setup

### 🔽 Clone Repository

git clone https://github.com/Vaibhav21022005/E-Commerce.git

### 📁 Move into Folder

cd E-Commerce

---

### 🔧 Backend Setup

cd backend
npm install
npm start

---

### 🎨 Frontend Setup

cd ../frontend
npm install
npm start

---

## 🌐 Run Application

👉 Frontend: http://localhost:3000
👉 Backend: http://localhost:5000 (or your configured port)

---

## 🔑 Environment Variables

Create a `.env` file inside backend folder and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret

---


## 🚀 Future Enhancements

🔍 Advanced Search & Filters
❤️ Wishlist Feature
📊 Analytics Dashboard

---

## 👨‍💻 Author

Vaibhav Dhone

---

## 📜 License

This project is developed for educational and learning purposes.

---

## ⭐ Support

If you like this project:
👉 Give it a star on GitHub
👉 Share with your friends

---
