# blogApp

# 📝 Blogify - A Modern Blog Platform

Blogify is a full-stack blog web application built using **Node.js**, **Express.js**, and **MongoDB**. It offers a dynamic public-facing blog, a secure admin dashboard for managing content, and an elegant UI with real-time notifications via **Notyf**.

---

## 🚀 Features

### 🌐 Public Pages

- **Home Page** – Displays all blog posts with clean UI.
- **About Page** – Information about the blog or author.
- **Contact Page** – A static contact/info section.
- **Pagination** – Seamlessly browse through older posts.

### 🔐 Authentication

- **Login & Logout** – Secure login system using JWT tokens and cookies.
- **Session & Cookie Handling** – Tracks user sessions securely.
- **Password Encryption** – Uses **bcrypt** to hash user passwords.

### 🛠️ Admin Dashboard

- **CRUD Functionality** – Create, Read, Update, and Delete blog posts.
- **Authentication Middleware** – Restricts access to admin routes.
- **Dashboard View** – View all posts with edit and delete options.
- **Flash Notifications** – Success/error messages via **Notyf** toast alerts.

---

## 📦 Tech Stack

| Technology             | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| **Node.js**            | JavaScript runtime environment                          |
| **Express.js**         | Fast, minimalist web framework for Node.js              |
| **MongoDB**            | NoSQL database for storing posts and user info          |
| **EJS**                | Embedded JavaScript templates for server-side rendering |
| **Notyf**              | Beautiful toast notifications for user feedback         |
| **bcrypt**             | Secure password hashing                                 |
| **JWT (jsonwebtoken)** | JSON Web Tokens for authentication                      |
| **cookie-parser**      | Middleware for parsing cookies                          |
| **express-session**    | Manages user sessions                                   |

---
