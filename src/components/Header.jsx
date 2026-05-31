import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <header className="bg-emerald-900 text-white p-4 shadow">
      <nav className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Link to="/" className="text-xl font-bold">
          MealDB
          </Link>
          <Link to="/">Categories</Link>
          <Link to="/favorites">Favorites</Link>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="bg-white px-3 py-1 rounded outline-none text-gray-900 w-48 sm:w-64" placeholder="Search meals"/>
          <button type="submit" className="bg-white text-emerald-900 px-3 py-1 rounded">Search</button>
        </form>
      </nav>
    </header>
  );
};

export default Header;