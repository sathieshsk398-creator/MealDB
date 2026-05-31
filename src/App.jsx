import { BrowserRouter,Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import CategoryMeals from "./pages/CategoryMeals";
import MealDetails from "./pages/MealDetails";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Favorite from "./pages/Favorite";
import SearchResults from "./pages/SearchResults";

const App = () => {
  return (
    <BrowserRouter>
     <FavoritesProvider>
      <Header />
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/category/:category" element={<CategoryMeals />} />
         <Route path="/meal/:id" element={<MealDetails />} />
         <Route path="/favorites" element={<Favorite />} />
         <Route path="/search" element={<SearchResults/>} />
         <Route path="*" element={<h1 className="text-center mt-20 text-5xl text-red-900">404 - Not Found</h1>} />    
      </Routes>
     </FavoritesProvider> 
     </BrowserRouter>
  );
};

export default App; 