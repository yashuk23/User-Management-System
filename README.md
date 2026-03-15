# User Management System

A full-stack **User Management System** built using **Node.js, Express.js, MongoDB, EJS, and Tailwind CSS**.
The application allows users to **register, login, and manage users securely with authentication and CRUD operations**.

---

## 🚀 Features

* User Registration
* User Login with Authentication
* Password hashing using **bcrypt**
* Secure authentication using **JWT**
* Cookie-based session handling
* Create new users
* View all users
* Edit user details
* Delete users
* Protected routes using middleware
* Server-side rendering with **EJS**
* Responsive UI using **Tailwind CSS**
* MongoDB integration using **Mongoose**

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcrypt
* cookie-parser
* dotenv

### Frontend

* EJS Template Engine
* Tailwind CSS

### Deployment

* MongoDB Atlas
* Render
* GitHub

---

## 📂 Project Structure

```
User-Management-System
│
├── models
│   └── user.js
│
├── views
│   ├── register.ejs
│   ├── login.ejs
│   ├── index.ejs
│   ├── read.ejs
│   └── edit.ejs
│
├── public
│
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```
git clone https://github.com/yashuk23/User-Management-System.git
```

Move into the project directory

```
cd User-Management-System
```

Install dependencies

```
npm install
```

Create `.env` file

```
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=your_secret_key
```

Run the application

```
node index.js
```

---

## 🌐 Usage

Open your browser and visit

```
http://localhost:8080
```

You can now:

* Register a new account
* Login securely
* Create users
* View users
* Edit user information
* Delete users

---

## 📸 Future Improvements

* Profile image upload using Multer
* Form validation
* Pagination for user list
* Role-based access control
* REST API support

---

## 👨‍💻 Author

**Yash Kanawade**

GitHub
https://github.com/yashuk23
