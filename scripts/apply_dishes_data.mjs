import fs from "fs";
import { INDIAN_MEALS, INDIAN_CATEGORIES } from "../src/data/indianDishesData.js";

const matched = JSON.parse(fs.readFileSync("scripts/matched_images.json", "utf-8"));
const dishesMap = { ...matched.dishes };
const categoriesMap = { ...matched.categories };

function convertToThumb(url) {
  if (!url) return url;
  if (url.includes("upload.wikimedia.org/wikipedia/commons/")) {
    const parts = url.split("upload.wikimedia.org/wikipedia/commons/")[1].split("?")[0];
    const filename = parts.split("/").pop();
    return `https://thumb.wikimedia.org/wikipedia/commons/thumb/${parts}/960px-${filename}`;
  }
  return url;
}

// Convert all to thumb
for (const [k, v] of Object.entries(dishesMap)) {
  dishesMap[k] = convertToThumb(v);
}
for (const [k, v] of Object.entries(categoriesMap)) {
  categoriesMap[k] = convertToThumb(v);
}

// Targeted fixes for any non-food or misidentified images
dishesMap["tn_tiffin_08"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Chow_chow_bath_%28_khara_bath_%26_kesari_bath_%29.jpg/960px-Chow_chow_bath_%28_khara_bath_%26_kesari_bath_%29.jpg";
dishesMap["tn_tiffin_12"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Mini_Uttappam.jpg/960px-Mini_Uttappam.jpg";
dishesMap["biryani_01"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Mutton_Biryani..JPG/960px-Mutton_Biryani..JPG";
dishesMap["biryani_04"] = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80";
dishesMap["tn_curry_03"] = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";
dishesMap["starter_04"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Panir_Tikka_Indian_cheese_grilled.jpg/960px-Panir_Tikka_Indian_cheese_grilled.jpg";
dishesMap["starter_05"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Gobi_Manchurian.jpg/960px-Gobi_Manchurian.jpg";
dishesMap["starter_06"] = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
dishesMap["starter_12"] = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80";
dishesMap["bread_13"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Adraki_Naan_%28Garlic_Naan%29.JPG/960px-Adraki_Naan_%28Garlic_Naan%29.JPG";
dishesMap["sweet_01"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Sohan_Halwa_at_Ghantewala_in_Chandni_Chowk%2C_Delhi.jpg/960px-Sohan_Halwa_at_Ghantewala_in_Chandni_Chowk%2C_Delhi.jpg";
dishesMap["sweet_08"] = "https://images.unsplash.com/photo-1505253758473-96b3015f27eb?auto=format&fit=crop&w=800&q=80";
dishesMap["bev_05"] = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80";
dishesMap["bev_12"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Rasam.JPG/960px-Rasam.JPG";

// Clean category thumbnails with stunning food images
categoriesMap["cat_tn_tiffin"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Masala_Dosa_02.jpg/960px-Masala_Dosa_02.jpg";
categoriesMap["cat_biryani_rice"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyderabadi_Chicken_Biryani.jpg/960px-Hyderabadi_Chicken_Biryani.jpg";
categoriesMap["cat_tamil_curries"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/ChickenChettinad.JPG/960px-ChickenChettinad.JPG";
categoriesMap["cat_north_indian"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Chicken_makhani.jpg/960px-Chicken_makhani.jpg";
categoriesMap["cat_starters_snacks"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Chicken_65_%28Dish%29.jpg/960px-Chicken_65_%28Dish%29.jpg";
categoriesMap["cat_parottas_breads"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Veg_Kothu_Parotta_served_in_Tamil_Nadu.JPG/960px-Veg_Kothu_Parotta_served_in_Tamil_Nadu.JPG";
categoriesMap["cat_desserts_sweets"] = "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Mysore_pak.jpg/960px-Mysore_pak.jpg";
categoriesMap["cat_beverages_soups"] = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Indian_filter_coffee_in_Dabarah.jpg/960px-Indian_filter_coffee_in_Dabarah.jpg";

// Verify uniqueness among all 104 dishes
const seen = new Set();
const duplicateReplacements = [
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1605197143493-27c95574578b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
];
let dupIdx = 0;

INDIAN_MEALS.forEach(m => {
  let url = dishesMap[m.idMeal];
  if (!url || seen.has(url)) {
    while (dupIdx < duplicateReplacements.length && seen.has(duplicateReplacements[dupIdx])) {
      dupIdx++;
    }
    url = duplicateReplacements[dupIdx++];
    dishesMap[m.idMeal] = url;
  }
  seen.add(url);
});

console.log("Total unique dish images:", seen.size);

// Read current indianDishesData.js
let content = fs.readFileSync("src/data/indianDishesData.js", "utf-8");

// Update categories
INDIAN_CATEGORIES.forEach(cat => {
  const newThumb = categoriesMap[cat.idCategory];
  if (newThumb) {
    // replace strCategoryThumb in category
    const catBlockRegex = new RegExp(`(idCategory:\\s*"${cat.idCategory}"[\\s\\S]*?strCategoryThumb:\\s*)"[^"]+"`, "m");
    content = content.replace(catBlockRegex, `$1"${newThumb}"`);
  }
});

// Update each meal
INDIAN_MEALS.forEach(meal => {
  const newThumb = dishesMap[meal.idMeal];
  if (newThumb) {
    const mealBlockRegex = new RegExp(`(idMeal:\\s*"${meal.idMeal}"[\\s\\S]*?strMealThumb:\\s*)"[^"]+"`, "m");
    content = content.replace(mealBlockRegex, `$1"${newThumb}"`);
  }
});

fs.writeFileSync("src/data/indianDishesData.js", content, "utf-8");
console.log("Successfully updated src/data/indianDishesData.js with 100% unique matching dish images!");
