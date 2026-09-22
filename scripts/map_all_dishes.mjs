import fs from "fs";
import { INDIAN_MEALS, INDIAN_CATEGORIES } from "../src/data/indianDishesData.js";

function convertToThumb(url) {
  if (!url) return url;
  if (url.includes("upload.wikimedia.org/wikipedia/commons/")) {
    const parts = url.split("upload.wikimedia.org/wikipedia/commons/")[1].split("?")[0];
    const filename = parts.split("/").pop();
    return `https://thumb.wikimedia.org/wikipedia/commons/thumb/${parts}/960px-${filename}`;
  }
  return url;
}

// Tailored search terms for finding real photos of each exact dish
const DISH_SEARCH_TERMS = {
  // Category 1: Tamil Nadu Tiffin
  "tn_tiffin_01": ["Masala dosa", "Dosa sambar chutney", "Crispy dosa"],
  "tn_tiffin_02": ["Kari Dosa", "Mutton dosa", "Madurai food non veg"],
  "tn_tiffin_03": ["Kanchipuram Idli", "Thatte Idli", "Steamed Idli"],
  "tn_tiffin_04": ["Podi Idli", "Ghee Podi Idli", "Fried Idli"],
  "tn_tiffin_05": ["Kuzhi Paniyaram", "Paniyaram", "Paddu"],
  "tn_tiffin_06": ["Ven Pongal", "Khara Pongal", "Pongal sambar"],
  "tn_tiffin_07": ["Medu Vada", "Medu Vadas", "Uzhunnu vada"],
  "tn_tiffin_08": ["Rava Kichadi", "Rava Upma", "Sooji Upma"],
  "tn_tiffin_09": ["Idiyappam", "String hoppers", "Sevai"],
  "tn_tiffin_10": ["Appam", "Paalappam", "Appam coconut"],
  "tn_tiffin_11": ["Poori Masala", "Puri bhaji", "Poori potato"],
  "tn_tiffin_12": ["Kal Dosa", "Set Dosa", "Vadacurry"],
  "tn_tiffin_13": ["Keerai Vadai", "Masala Vadai", "Dal Vada"],

  // Category 2: Biryani & Rice
  "biryani_01": ["Mutton Biryani", "Dindigul Thalappakatti", "Seeraga samba mutton"],
  "biryani_02": ["Ambur Biryani", "Chicken Biryani South India", "Tamil biryani"],
  "biryani_03": ["Seeraga Samba Biryani", "Chettinad Chicken Biryani", "Kozhi Biryani"],
  "biryani_04": ["Chennai Biryani", "Muslim Wedding Biryani", "Dum Chicken Biryani"],
  "biryani_05": ["Prawn Biryani", "Shrimp Biryani", "Prawn Pulao"],
  "biryani_06": ["Hyderabadi Biryani", "Hyderabadi Dum Biryani", "Gosht Biryani"],
  "biryani_07": ["Mushroom Biryani", "Mushroom Pulao", "Kalan Biryani"],
  "biryani_08": ["Paneer Biryani", "Paneer Tikka Biryani", "Veg Biryani"],
  "biryani_09": ["Sambar Sadam", "Sambar Rice", "Bisi Bele Bath"],
  "biryani_10": ["Bisi Bele Bath", "Bisibelebath", "Sambar Rice South India"],
  "biryani_11": ["Curd Rice", "Thayir Sadam", "Bagala Bath"],
  "biryani_12": ["Puliyodharai", "Tamarind Rice", "Puliyogare"],
  "biryani_13": ["Lemon Rice", "Chitranna", "Elumichai Sadam"],

  // Category 3: Tamil Curries & Gravies
  "tn_curry_01": ["Chicken Chettinad", "Chettinad Chicken Curry", "Pepper Chicken gravy"],
  "tn_curry_02": ["Ennai Kathirikai", "Bagara Baingan", "Brinjal curry"],
  "tn_curry_03": ["Mutton Sukka", "Mutton Chukka", "Mutton Varuval"],
  "tn_curry_04": ["Meen Kulambu", "Fish Curry South India", "Kerala Fish Curry"],
  "tn_curry_05": ["Kara Kuzhambu", "Poondu Kuzhambu", "Vatha Kuzhambu"],
  "tn_curry_06": ["Avial", "Kerala Avial", "Tamil Avial"],
  "tn_curry_07": ["Mor Kuzhambu", "Moru curry", "Kadhi Pakora"],
  "tn_curry_08": ["Crab Curry", "Nandu Masala", "Crab Masala"],
  "tn_curry_09": ["Paruppu Urundai Kuzhambu", "Kofta curry", "Lentil kofta"],
  "tn_curry_10": ["Egg Curry", "Muttai Curry", "Egg Roast"],
  "tn_curry_11": ["Vazhaipoo Kulambu", "Banana flower curry", "Plantain flower"],
  "tn_curry_12": ["Nattu Kozhi", "Country chicken curry", "Kozhi Kulambu"],
  "tn_curry_13": ["Bhindi Masala", "Okra curry", "Vendakkai Puli Mandi"],

  // Category 4: North Indian Delights
  "north_01": ["Butter Chicken", "Murgh Makhani", "Chicken Makhani"],
  "north_02": ["Paneer Tikka Masala", "Paneer Makhani", "Paneer Butter Masala"],
  "north_03": ["Dal Makhani", "Maa ki Dal", "Black Dal"],
  "north_04": ["Rogan Josh", "Mutton Rogan Josh", "Kashmiri Curry"],
  "north_05": ["Kadai Chicken", "Karahi Chicken", "Chicken Kadhai"],
  "north_06": ["Shahi Paneer", "White Gravy Paneer", "Mughlai Paneer"],
  "north_07": ["Malai Kofta", "Kofta gravy", "Paneer Kofta"],
  "north_08": ["Chana Masala", "Chole Masala", "Pindi Chole"],
  "north_09": ["Palak Paneer", "Saag Paneer", "Spinach Paneer"],
  "north_10": ["Dal Tadka", "Yellow Dal", "Toor Dal fry"],
  "north_11": ["Chicken Tikka Masala", "Chicken Tikka Lababdar", "Chicken Curry"],
  "north_12": ["Bhindi Do Pyaza", "Bhindi fry", "Okra onion"],
  "north_13": ["Aloo Gobi", "Aloo Gobi Masala", "Potato Cauliflower curry"],

  // Category 5: Starters & Snacks
  "starter_01": ["Chicken 65", "Chicken 65 Dish", "Crispy fried chicken south india"],
  "starter_02": ["Mutton Chukka", "Mutton fry", "Sukka mutton"],
  "starter_03": ["Fish Fry", "Nethili Fry", "Fried Fish Indian"],
  "starter_04": ["Paneer 65", "Paneer Tikka", "Fried Paneer"],
  "starter_05": ["Gobi 65", "Gobi Manchurian", "Fried Cauliflower"],
  "starter_06": ["Mushroom Pepper Fry", "Kalan Varuval", "Fried Mushrooms"],
  "starter_07": ["Prawn Fry", "Fried Prawns", "Eral Varuval"],
  "starter_08": ["Samosa", "Punjabi Samosa", "Samosas"],
  "starter_09": ["Onion Pakoda", "Pakora", "Onion Bhaji"],
  "starter_10": ["Masala Vada", "Parippu Vada", "Dal Vada"],
  "starter_11": ["Chicken Lollipop", "Chicken Wings Fried", "Chicken Drumettes"],
  "starter_12": ["Vazhaipoo Vadai", "Banana flower vadai", "Crispy Vadai"],
  "starter_13": ["Baby Corn Fry", "Crispy Baby Corn", "Baby Corn Manchurian"],

  // Category 6: Parottas & Breads
  "bread_01": ["Bun Parotta", "Madurai Parotta", "Parotta"],
  "bread_02": ["Chicken Kothu Parotta", "Kothu Roti", "Kothu Parotta"],
  "bread_03": ["Egg Kothu Parotta", "Muttai Parotta", "Kothu Roti egg"],
  "bread_04": ["Ceylon Parotta", "Murtabak", "Stuffed Parotta"],
  "bread_05": ["Malabar Parotta", "Kerala Parotta", "Porotta"],
  "bread_06": ["Veg Kothu Parotta", "Vegetable Kothu", "Veg Kothu Roti"],
  "bread_07": ["Garlic Naan", "Butter Garlic Naan", "Naan bread"],
  "bread_08": ["Tandoori Roti", "Roti tandoor", "Whole wheat roti"],
  "bread_09": ["Butter Naan", "Naan", "Indian bread"],
  "bread_10": ["Aloo Paratha", "Aloo Parantha", "Stuffed Paratha"],
  "bread_11": ["Rumali Roti", "Manda Roti", "Soft Roti"],
  "bread_12": ["Paneer Paratha", "Paneer stuffed flatbread", "Paratha"],
  "bread_13": ["Cheese Garlic Naan", "Cheese Naan", "Garlic Naan cheese"],

  // Category 7: Desserts & Sweets
  "sweet_01": ["Tirunelveli Halwa", "Wheat Halwa", "Halwa sweet"],
  "sweet_02": ["Mysore Pak", "Ghee Mysore Pak", "Mysorepa"],
  "sweet_03": ["Rava Kesari", "Kesari Bath", "Sooji Halwa"],
  "sweet_04": ["Gulab Jamun", "Gulab Jamuns", "Jamun sweet"],
  "sweet_05": ["Ras Malai", "Rasmalai", "Rossomalai"],
  "sweet_06": ["Ada Pradhaman", "Palada Payasam", "Payasam"],
  "sweet_07": ["Paruppu Payasam", "Parippu Payasam", "Chana dal kheer"],
  "sweet_08": ["Elaneer Payasam", "Tender Coconut Kheer", "Coconut payasam"],
  "sweet_09": ["Badam Halwa", "Almond Halwa", "Almond sweet"],
  "sweet_10": ["Kaju Katli", "Kaju Barfi", "Cashew fudge"],
  "sweet_11": ["Motichoor Ladoo", "Boondi Ladoo", "Laddu"],
  "sweet_12": ["Jangiri", "Imarti", "Jalebi"],
  "sweet_13": ["Shahi Tukda", "Double Ka Meetha", "Bread pudding indian"],

  // Category 8: Beverages & Soups
  "bev_01": ["Indian filter coffee", "Filter coffee dabarah", "Kaapi"],
  "bev_02": ["Jigarthanda", "Madurai Jigarthanda", "Jigarthanda drink"],
  "bev_03": ["Nannari Sarbath", "Sarsaparilla drink", "Sharbat"],
  "bev_04": ["Masala Chai", "Chai tea", "Indian tea"],
  "bev_05": ["Neer Mor", "Chaas", "Spiced Buttermilk"],
  "bev_06": ["Panakam", "Panakam drink", "Jaggery drink"],
  "bev_07": ["Mango Lassi", "Aam lassi", "Mango yogurt"],
  "bev_08": ["Sukku Malli Coffee", "Kashayam", "Herbal coffee"],
  "bev_09": ["Rose Milk", "Bandung drink", "Chilled rose milk"],
  "bev_10": ["Badam Milk", "Badam drink", "Almond milk saffron"],
  "bev_11": ["Sweet Lassi", "Punjabi Lassi", "Yogurt lassi"],
  "bev_12": ["Chicken Soup", "Kozhi Rasam", "Chicken broth"],
  "bev_13": ["Mutton Soup", "Aattukkal Soup", "Bone Broth soup"]
};

// Category banner queries
const CATEGORY_SEARCH_TERMS = {
  "cat_tn_tiffin": ["Dosa platter", "South Indian breakfast", "Idli Vada Sambar"],
  "cat_biryani_rice": ["Biryani handi", "Dum Biryani", "Hyderabadi Biryani"],
  "cat_tamil_curries": ["Chettinad curry", "South Indian curry", "Meen curry"],
  "cat_north_indian": ["Butter chicken naan", "North Indian thali", "Dal makhani"],
  "cat_starters_snacks": ["Chicken 65", "Indian snacks platter", "Samosa pakora"],
  "cat_parottas_breads": ["Malabar Parotta", "Tandoori roti naan", "Kothu parotta"],
  "cat_desserts_sweets": ["Indian sweets platter", "Gulab Jamun", "Mithai"],
  "cat_beverages_soups": ["Filter coffee dabarah", "Masala Chai glass", "Indian beverages"]
};

// Distinct verified high-res food photo IDs
const BACKUP_UNSPLASH_POOL = [
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
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
  "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505253758473-96b3015f27eb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
];

async function searchCommons(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": "TamilFoodCollector/1.0 (info@tamilcuisine.app)" } });
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];
    return Object.values(data.query.pages)
      .map(p => {
        let raw = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
        return {
          title: p.title,
          thumbUrl: convertToThumb(raw)
        };
      })
      .filter(x => {
        if (!x.thumbUrl) return false;
        const low = x.title.toLowerCase();
        return !low.endsWith(".svg") && !low.endsWith(".ogg") && !low.endsWith(".pdf") && !low.endsWith(".tif") && !low.endsWith(".gif");
      });
  } catch (err) {
    return [];
  }
}

async function verifyUrl(url) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "TamilFoodCollector/1.0 (info@tamilcuisine.app)", "Range": "bytes=0-50" },
      signal: ctrl.signal
    });
    clearTimeout(timer);
    return res.status === 200 || res.status === 206;
  } catch (e) {
    return false;
  }
}

async function main() {
  console.log("Starting image collection for all dishes...");
  const usedUrls = new Set();
  const resultMap = {};
  let backupIdx = 0;

  for (let i = 0; i < INDIAN_MEALS.length; i++) {
    const meal = INDIAN_MEALS[i];
    const queries = DISH_SEARCH_TERMS[meal.idMeal] || [meal.strMeal];
    let selectedUrl = null;

    for (const q of queries) {
      const candidates = await searchCommons(q);
      for (const cand of candidates) {
        if (!usedUrls.has(cand.thumbUrl)) {
          const ok = await verifyUrl(cand.thumbUrl);
          if (ok) {
            selectedUrl = cand.thumbUrl;
            break;
          }
        }
      }
      if (selectedUrl) break;
    }

    if (!selectedUrl) {
      while (backupIdx < BACKUP_UNSPLASH_POOL.length && usedUrls.has(BACKUP_UNSPLASH_POOL[backupIdx])) {
        backupIdx++;
      }
      if (backupIdx < BACKUP_UNSPLASH_POOL.length) {
        selectedUrl = BACKUP_UNSPLASH_POOL[backupIdx++];
      } else {
        selectedUrl = `https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80&dish=${meal.idMeal}`;
      }
    }

    usedUrls.add(selectedUrl);
    resultMap[meal.idMeal] = selectedUrl;
    if ((i + 1) % 10 === 0 || i === INDIAN_MEALS.length - 1) {
      console.log(`Processed ${i + 1}/${INDIAN_MEALS.length} dishes...`);
    }
  }

  // Categories
  const categoryMap = {};
  for (const cat of INDIAN_CATEGORIES) {
    const queries = CATEGORY_SEARCH_TERMS[cat.idCategory] || [cat.strCategory];
    let selectedCatUrl = null;
    for (const q of queries) {
      const candidates = await searchCommons(q);
      for (const cand of candidates) {
        if (!usedUrls.has(cand.thumbUrl)) {
          const ok = await verifyUrl(cand.thumbUrl);
          if (ok) {
            selectedCatUrl = cand.thumbUrl;
            break;
          }
        }
      }
      if (selectedCatUrl) break;
    }
    if (!selectedCatUrl) {
      selectedCatUrl = cat.strCategoryThumb;
    }
    usedUrls.add(selectedCatUrl);
    categoryMap[cat.idCategory] = selectedCatUrl;
  }

  fs.writeFileSync("scripts/matched_images.json", JSON.stringify({ dishes: resultMap, categories: categoryMap }, null, 2));
  console.log(`Done! Total unique URLs: ${usedUrls.size}`);
}

main();
