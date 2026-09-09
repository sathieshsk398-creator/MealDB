# 🍽️ MealDB

A modern recipe discovery web application built with **React** and **Vite**, powered by the free [TheMealDB API](https://www.themealdb.com/api.php). Browse meal categories, search for recipes, view detailed cooking instructions, and save your favorite dishes for later — all in a fast, responsive interface.

## ✨ Features

- **Browse by Category** — Explore meals organized into categories (Seafood, Dessert, Vegetarian, and more)
- **Recipe Search** — Search the full recipe database by dish name
- **Detailed Recipe View** — Full ingredient list with measurements, step-by-step instructions, and a linked YouTube tutorial where available
- **Favorites** — Save recipes to a personal favorites list, persisted in the browser via `localStorage`
- **Responsive Design** — Clean, mobile-friendly UI styled with Tailwind CSS
- **Client-Side Routing** — Smooth navigation between pages using React Router

## 🛠️ Tech Stack

| Category         | Technology                                      |
|-------------------|--------------------------------------------------|
| Framework         | [React 19](https://react.dev/)                  |
| Build Tool        | [Vite](https://vitejs.dev/)                     |
| Styling           | [Tailwind CSS](https://tailwindcss.com/)        |
| Routing           | [React Router](https://reactrouter.com/)        |
| HTTP Client       | [Axios](https://axios-http.com/)                |
| Data Source       | [TheMealDB API](https://www.themealdb.com/api.php) |
| Linting           | ESLint                                          |

## 📂 Project Structure

```
mealdb/
├── public/                 # Static assets
├── src/
│   ├── api/                # API request functions (TheMealDB endpoints)
│   ├── assets/              # Images and static media
│   ├── components/          # Reusable UI components (Header, MealCard, etc.)
│   ├── contexts/             # React Context providers (Favorites state)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Route-level page components
│   ├── App.jsx                # Root component and route definitions
│   └── main.jsx                # Application entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/mealdb.git
   cd mealdb
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

| Command           | Description                              |
|-------------------|-------------------------------------------|
| `npm run dev`     | Start the local development server        |
| `npm run build`   | Build the app for production              |
| `npm run preview` | Preview the production build locally      |
| `npm run lint`    | Run ESLint checks                         |

## 🔌 API Reference

This project consumes the free public [TheMealDB API](https://www.themealdb.com/api.php) (test key `1`), which provides recipe categories, search, and full recipe details at no cost. No API key or environment configuration is required to run this project locally.

| Endpoint              | Purpose                              |
|------------------------|----------------------------------------|
| `/categories.php`      | Fetch all meal categories             |
| `/filter.php?c=`      | Fetch meals filtered by category      |
| `/lookup.php?i=`      | Fetch full details for a single meal  |
| `/search.php?s=`      | Search meals by name                  |

## 🗺️ Routes

| Path                 | Page              | Description                        |
|-----------------------|--------------------|--------------------------------------|
| `/`                   | Home               | Grid of all meal categories         |
| `/category/:category` | Category Meals     | Meals within a selected category    |
| `/meal/:id`           | Meal Details       | Full recipe: ingredients, instructions, video |
| `/favorites`          | Favorites          | User's saved favorite meals         |
| `/search?q=`          | Search Results     | Results matching a search query     |

## Conclusion

MealDB is a fully functional recipe discovery app that demonstrates practical React skills — component-based architecture, client-side routing, context-based state management, and third-party API integration. It combines a clean, responsive UI with persistent favorites to deliver a smooth recipe browsing experience, powered entirely by TheMealDB's free public API.

## 👤 Author

**Sathiesh Kumar M**

View my app in: https://mealdb-app.onrender.com/
