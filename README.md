# 🍽️ 🍛 Dishly — South Indian Food Delivery Platform

Dishly is a full-stack food delivery web application focused on authentic **South Indian and Tamil Nadu cuisine**. It combines a curated regional menu (biryanis, tiffin, kulambu, parottas, sweets, and more) with the everyday features of a modern delivery app — browsing, search, cart, checkout, order tracking, and an admin dashboard for managing the menu and monitoring sales.

The application is built as a **React (Vite) single-page frontend** paired with a lightweight **Node.js/Express + MongoDB backend** that handles authentication and cart persistence.

## ✨ Features

### Customer Experience
- **Curated Regional Menu** — Dishes organized into authentic categories (Tamil Nadu Tiffin, Biryani & Rice, Tamil Curries & Gravies, North Indian Delights, Starters & Snacks, Parottas & Breads, Desserts & Sweets, Beverages & Soups)
- **Search & Category Browsing** — Full-text dish search and category-based filtering with friendly aliases (e.g. "breakfast" → Tiffin)
- **Detailed Dish View** — Ingredients, preparation details, and pricing for every dish
- **Cart & Checkout** — Add, update, and remove items with live quantity and price totals
- **Order Tracking & History** — Track an active order's status and review past orders
- **Favorites** — Save preferred dishes for quick access later
- **Address Book** — Save and manage multiple delivery addresses
- **Multi-Currency Display** — Toggle pricing between INR and USD
- **User Authentication** — Register, log in, and manage a personal profile
- **Splash Screen & Responsive UI** — Polished onboarding experience, optimized for mobile and desktop

### Admin Panel
- **Sales Dashboard** — Revenue and top-selling item charts (via Recharts)
- **Menu Management** — Add new dishes directly from the admin interface
- **Order Overview** — Recent orders table with key metrics at a glance

## 🛠️ Tech Stack

| Layer              | Technology                                                        |
|---------------------|---------------------------------------------------------------------|
| Frontend Framework  | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)       |
| Styling             | [Tailwind CSS 4](https://tailwindcss.com/)                         |
| Routing             | [React Router 7](https://reactrouter.com/)                         |
| State Management    | React Context API (Auth, Cart, Favorites, Address, Currency)       |
| Charts              | [Recharts](https://recharts.org/)                                  |
| Icons               | [Lucide React](https://lucide.dev/)                                |
| HTTP Client         | [Axios](https://axios-http.com/)                                   |
| Backend Runtime     | [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) |
| Database            | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| Authentication      | [JSON Web Tokens](https://jwt.io/) + [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| Linting             | ESLint                                                              |

## 🏗️ Architecture

- **Frontend** — Renders the storefront and admin UI, reads dish/category data from a local curated dataset (`src/data/indianDishesData.js`), and communicates with the backend for authentication and cart persistence.
- **Backend** — A minimal Express REST API responsible for user auth (registration, login, JWT-protected profile) and per-user cart storage in MongoDB. Favorites, addresses, order history, and currency preference are currently managed client-side.

```
Client (React/Vite)  ─── Axios ───►  Express API  ───►  MongoDB
   │
   └── Local curated dish/category dataset (no external food API dependency)
```

## 📂 Project Structure

```
dishly/
├── backend/
│   ├── config/           # Database connection setup
│   ├── controllers/      # Auth and cart request handlers
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # Mongoose schemas (User, Cart)
│   ├── routes/           # Express route definitions
│   └── server.js         # Backend entry point
├── src/
│   ├── api/               # Frontend data-access layer (categories, meals, search)
│   ├── assets/             # Images and static media
│   ├── components/          # Reusable UI components (Header, MealCard, admin widgets, etc.)
│   ├── contexts/             # React Context providers (Auth, Cart, Favorites, Address, Currency, Admin)
│   ├── data/                  # Curated South Indian dish and category dataset
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                   # Route-level page components
│   ├── utils/                    # Pricing, order storage, analytics, custom dish helpers
│   ├── App.jsx                    # Root component and route definitions
│   └── main.jsx                    # Application entry point
├── scripts/                # One-off data-mapping/image-matching utility scripts
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (or [Bun](https://bun.sh/), since a `bun.lock` is included)
- A running [MongoDB](https://www.mongodb.com/) instance (local or a hosted cluster such as MongoDB Atlas) — only required if you want authentication and cart persistence

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/dishly.git
cd dishly
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root for the backend:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mealdb
JWT_SECRET=your_jwt_secret_here
```

For the frontend, set the API base URL (used to reach the backend) via `VITE_API_BASE_URL` in a `.env` file, or update `src/config.js` directly:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Run the backend API
```bash
npm run server
```
The API starts at `http://localhost:5000` by default.

### 5. Run the frontend
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Testing on a mobile device?** Replace `localhost` with your machine's local Wi-Fi IP address in `src/config.js` (or `VITE_API_BASE_URL`) so your phone can reach the backend — both devices must be on the same network.

### Available Scripts

| Command          | Description                                      |
|-------------------|----------------------------------------------------|
| `npm run dev`     | Start the Vite frontend development server          |
| `npm run server`  | Start the Express backend API                       |
| `npm run start`   | Alias for starting the backend (`node server.js`)    |
| `npm run build`   | Build the frontend for production                    |
| `npm run preview` | Preview the production frontend build locally         |
| `npm run lint`    | Run ESLint checks                                     |

## 🔌 Backend API Reference

Base URL: `http://localhost:5000` (or your deployed backend URL)

| Method | Endpoint                 | Description                          | Auth Required |
|--------|----------------------------|-----------------------------------------|:---:|
| GET    | `/api/health`              | Health check                            | No |
| POST   | `/api/auth/register`       | Register a new user                     | No |
| POST   | `/api/auth/login`          | Log in and receive a JWT                | No |
| GET    | `/api/auth/profile`        | Get the authenticated user's profile    | Yes |
| GET    | `/api/cart`                 | Get the current user's cart             | Yes |
| POST   | `/api/cart`                  | Add or update an item in the cart       | Yes |
| DELETE | `/api/cart/:idMeal`            | Remove a specific item from the cart    | Yes |
| DELETE | `/api/cart`                      | Clear the cart                          | Yes |

Menu, category, and pricing data is served from a local curated dataset rather than an external API, so the storefront works without any third-party food API key.

## 🗺️ Frontend Routes

| Path                     | Page            | Description                                  |
|----------------------------|-------------------|--------------------------------------------------|
| `/`                         | Home              | Featured categories and dishes                    |
| `/category/:category`       | Category Meals    | Dishes within a selected category                 |
| `/meal/:id`                  | Meal Details      | Full dish details and pricing                      |
| `/search`                     | Search Results    | Results matching a search query                     |
| `/favorites`                    | Favorites         | User's saved dishes                                   |
| `/login`, `/register`             | Auth              | Sign in or create an account                            |
| `/cart` 🔒                          | Cart              | Review and edit cart contents                            |
| `/profile` 🔒                        | Profile           | Manage account and saved addresses                        |
| `/order-tracking` 🔒                  | Order Tracking    | Track an active order                                       |
| `/order-history` 🔒                    | Order History     | View past orders                                              |

🔒 = requires authentication (enforced via `ProtectedRoute`)

## 🧭 Roadmap Ideas
- Migrate favorites, addresses, and order history from client-side storage to the backend
- Add payment gateway integration
- Add real-time order status updates (WebSockets)
- Restore and harden the admin dashboard behind role-based route protection

## 👤 Author

**Sathiesh Kumar M**
## Conclusion

MealDB is a fully functional recipe discovery app that demonstrates practical React skills — component-based architecture, client-side routing, context-based state management, and third-party API integration. It combines a clean, responsive UI with persistent favorites to deliver a smooth recipe browsing experience, powered entirely by TheMealDB's free public API.

## 👤 Author

**Sathiesh Kumar M**

View my app in: https://mealdb-app.onrender.com
