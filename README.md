# 💬 Nexwave — Real-Time Chat & Video Call App

**Nexwave** is a modern full-stack application enabling **real-time 1:1**, as well as **high-quality video calling** — powered by the **MERN stack** and **Stream API**.

With a clean, responsive UI and seamless chat + call experience, Nexwave is designed to elevate digital communication for modern users.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages & Screens](#-pages--screens)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Author](#-author)
---

## 🚀 Features

- 🔁 Real-time 1:1 and group chat
- 👤 Secure user authentication (token-based)
- 💬 Typing indicators & threaded replies
- 🟢 Online/offline user presence detection
- 📱 Fully responsive UI (desktop & mobile)

---

## 🛠 Tech Stack

### 🔹 Frontend

- **React.js (Vite)**
- **Tailwind CSS**
- **React Router DOM**
- **Stream Chat React SDK**
- **Stream Video SDK**

### 🔹 Backend

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Stream Server SDK**

---

## 📄 Pages & Screens

| Page / Screen    | Description                                              |
|------------------|----------------------------------------------------------|
| **Login / Signup**   | Simple login using token-based authentication         |
| **Home / Chat List** | Shows recent conversations, create DMs                |
| **Chat Window**      | Real-time messages, threads, typing indicators        |
| **Video Call**       | video calls using Stream Video SDK            |
| **User Profile**     | View basic profile, logout functionality              |

---

## 📁 Folder Structure

### Backend (`/backend`)

backend/
├── src/
│ ├── controllers/ # Auth, Chat, User controllers
│ ├── lib/ # db.js (MongoDB), stream.js (Stream SDK)
│ ├── middleware/ # Auth middleware
│ ├── models/ # Mongoose models: User, FriendRequest
│ ├── routes/ # Express routes: auth, chat, user
│ └── server.js # Main Express server entry
├── .env
├── package.json


### Frontend (`/frontend`)

frontend/
├── public/
├── src/
│ ├── assets/ # Icons, images, logos
│ ├── components/ # UI components
│ ├── constants/ # Static configuration
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # API and utility functions
│ ├── pages/ # All app pages
│ ├── store/ # Zustand/Redux store
│ ├── App.jsx / main.jsx # Entry points
├── .env
├── README.md
├── vite.config.js
├── tailwind.config.js
├── package.json

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nexwave-chat-app.git
cd nexwave-chat-app
```

### 2. Install dependencies
```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3. Add .env files
Create .env in the backend/ directory and add your:
```
PORT=5000
MONGO_URL=your_mongodb_url
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

### 4. Run the app
bash
```
cd backend
npm start

cd frontend
npm run dev
```

👨‍💻 Author
Aditya Tallhari
GitHub: @adityatallhari
