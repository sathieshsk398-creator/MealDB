import axios from "axios";
const BASE = "https://www.themealdb.com/api/json/v1/1";

export const fetchCategories = () => axios.get(`${BASE}/categories.php`);
export const fetchMealsByCategory = (cat) => axios.get(`${BASE}/filter.php?c=${cat}`);
export const fetchMealsById = (id) => axios.get(`${BASE}/lookup.php?i=${id}`);
export const searchMeals = (query) => axios.get(`${BASE}/search.php?s=${query}`);