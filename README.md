# Issue Tracker

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)

A modern, high-performance Issue Tracking system designed for efficiency and clarity. This full-stack application provides a premium, minimalistic dashboard for managing tasks, tracking progress, and collaborating across roles.

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based authentication with Bcrypt password hashing and protected routes.
- **👥 Role-Based Access Control:** Manage users with specific roles (Admin, Manager, Staff) and tailored permissions.
- **📊 Premium Dashboard:** A sleek, responsive UI built with **Material UI** and **Framer Motion** for smooth transitions.
- **📍 Detailed Issue Management:** Create, update, and monitor issues with fields for location, priority, status, and image attachments.
- **🌗 Light/Dark Mode:** Fully integrated theme toggling for a comfortable user experience.
- **⚡ Optimized Performance:** Server-side pagination and efficient data fetching via Axios and Zustand.
- **📱 Responsive Design:** Fully mobile-friendly layout that works across all devices.

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19 + Vite
- **UI Components:** Material UI (MUI)
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Routing:** React Router DOM
- **Styling:** Emotion (Styled Components)

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Security:** JWT, Bcrypt
- **Logging:** Morgan
- **Dev Tools:** Nodemon

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd issue-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

## 📂 Project Structure

```text
issue-tracker/
├── backend/
│   ├── config/      # Database configuration
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose schemas (Issue, User)
│   ├── routes/      # API endpoints
│   └── middleware/  # Auth & error handling
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # View components (Dashboard, Auth, etc.)
    │   ├── store/      # Zustand state management
    │   ├── services/   # API service calls (Axios)
    │   └── theme.ts    # MUI theme configuration
```

## 📜 License

This project is licensed under the **ISC License**.

---

_Developed by [Prasad Wickramarathna](https://github.com/PrasadWc)_
