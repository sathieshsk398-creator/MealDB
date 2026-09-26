// Complete World Cuisine Dishes Database
// Provides chef-standard, authentic recipes for all world cuisine categories

import frenchSoupsImg from "../assets/images/french_soups_1790341791046.jpg";
import thaiSoupsImg from "../assets/images/thai_soups_1790341807440.jpg";
import britishPuddingsImg from "../assets/images/british_puddings_1790341822028.jpg";
import tandooriStartersImg from "../assets/images/tandoori_starters_1790341368874.jpg";
import italianPastaImg from "../assets/images/italian_pasta_1790341384144.jpg";
import butterNaanImg from "../assets/images/butter_naan_1790239783407.jpg";
import northMithaiImg from "../assets/images/north_mithai_1790341399572.jpg";

import { northIndianRecipes } from "./worldRecipes/northIndianRecipes.js";
import { italianRecipes } from "./worldRecipes/italianRecipes.js";
import { chineseRecipes } from "./worldRecipes/chineseRecipes.js";
import { mexicanRecipes } from "./worldRecipes/mexicanRecipes.js";
import { japaneseRecipes } from "./worldRecipes/japaneseRecipes.js";
import { americanRecipes } from "./worldRecipes/americanRecipes.js";
import { frenchRecipes } from "./worldRecipes/frenchRecipes.js";
import { thaiRecipes } from "./worldRecipes/thaiRecipes.js";
import { britishRecipes } from "./worldRecipes/britishRecipes.js";
import { greekRecipes } from "./worldRecipes/greekRecipes.js";
import { spanishRecipes } from "./worldRecipes/spanishRecipes.js";
import { turkishRecipes } from "./worldRecipes/turkishRecipes.js";
import { moroccanRecipes } from "./worldRecipes/moroccanRecipes.js";
import { canadianRecipes } from "./worldRecipes/canadianRecipes.js";
import { vietnameseRecipes } from "./worldRecipes/vietnameseRecipes.js";
import { malaysianRecipes } from "./worldRecipes/malaysianRecipes.js";
import { PAKISTANI_RECIPES } from "./worldRecipes/pakistaniRecipes.js";

// Enhance specific dishes with user-crafted high-resolution local assets
const enhancedNorthIndian = northIndianRecipes.map((m) => {
  if (m.idMeal === "world_ni_07" && tandooriStartersImg) return { ...m, strMealThumb: tandooriStartersImg };
  if (m.idMeal === "world_ni_13" && butterNaanImg) return { ...m, strMealThumb: butterNaanImg };
  if (m.idMeal === "world_ni_19" && northMithaiImg) return { ...m, strMealThumb: northMithaiImg };
  return m;
});

const enhancedItalian = italianRecipes.map((m) => {
  if (m.idMeal === "world_it_01" && italianPastaImg) return { ...m, strMealThumb: italianPastaImg };
  return m;
});

const enhancedFrench = frenchRecipes.map((m) => {
  if (m.idMeal === "world_fr_07" && frenchSoupsImg) return { ...m, strMealThumb: frenchSoupsImg };
  return m;
});

const enhancedThai = thaiRecipes.map((m) => {
  if (m.idMeal === "world_th_13" && thaiSoupsImg) return { ...m, strMealThumb: thaiSoupsImg };
  return m;
});

const enhancedBritish = britishRecipes.map((m) => {
  if (m.idMeal === "world_uk_13" && britishPuddingsImg) return { ...m, strMealThumb: britishPuddingsImg };
  return m;
});

export const WORLD_DISHES = [
  ...enhancedNorthIndian,
  ...enhancedItalian,
  ...chineseRecipes,
  ...mexicanRecipes,
  ...japaneseRecipes,
  ...americanRecipes,
  ...enhancedFrench,
  ...enhancedThai,
  ...enhancedBritish,
  ...greekRecipes,
  ...spanishRecipes,
  ...turkishRecipes,
  ...moroccanRecipes,
  ...canadianRecipes,
  ...vietnameseRecipes,
  ...malaysianRecipes,
  ...PAKISTANI_RECIPES,
];

export default WORLD_DISHES;
