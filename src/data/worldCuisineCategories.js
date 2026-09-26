// Comprehensive Multilingual Categories and Dish Database for World Cuisines
// Meets user requirement: "Tamil nadu dishes ku thani thani categories irukkamatri, matha yella Cuisines & Areas ku thani thani categories fix pannu"

import tandooriStartersImg from "../assets/images/tandoori_starters_1790341368874.jpg";
import italianPastaImg from "../assets/images/italian_pasta_1790341384144.jpg";
import butterNaanImg from "../assets/images/butter_naan_1790239783407.jpg";
import northMithaiImg from "../assets/images/north_mithai_1790341399572.jpg";
import frenchSoupsImg from "../assets/images/french_soups_1790341791046.jpg";
import thaiSoupsImg from "../assets/images/thai_soups_1790341807440.jpg";
import britishPuddingsImg from "../assets/images/british_puddings_1790341822028.jpg";

export const CUISINE_AREAS_META = [
  { strArea: "Tamil Nadu", flag: "🇮🇳", description: "Dosas, Idlis, Chettinad Kulambu, Biryani & Traditional Sweets" },
  { strArea: "North Indian", flag: "🇮🇳", description: "Butter Chicken, Paneer Tikka, Tandoori Breads, Kebabs & Mithai" },
  { strArea: "Pakistani", flag: "🇵🇰", description: "Karachi Biryani, Lahori Karahi, Chapli Kebabs, Nihari & Shahi Desserts" },
  { strArea: "Italian", flag: "🇮🇹", description: "Handmade Pastas, Stonebaked Pizzas, Risottos & Tiramisu" },
  { strArea: "Chinese", flag: "🇨🇳", description: "Wok Noodles, Dim Sum, Dumplings, Kung Pao & Sizzling Dishes" },
  { strArea: "Mexican", flag: "🇲🇽", description: "Street Tacos, Cheesy Enchiladas, Sizzling Fajitas & Churros" },
  { strArea: "Japanese", flag: "🇯🇵", description: "Rich Broth Ramen, Donburi Bowls, Crispy Tempura & Sushi Rolls" },
  { strArea: "American", flag: "🇺🇸", description: "Smash Burgers, Hickory Smoked BBQ, Mac & Cheese, Apple Pies" },
  { strArea: "French", flag: "🇫🇷", description: "Coq au Vin, Beef Bourguignon, French Onion Soup & Crème Brûlée" },
  { strArea: "Thai", flag: "🇹🇭", description: "Aromatic Green Curries, Pad Thai, Tom Yum & Mango Sticky Rice" },
  { strArea: "British", flag: "🇬🇧", description: "Crispy Fish & Chips, Sunday Roasts, Savory Pies & Toffee Pudding" },
  { strArea: "Greek", flag: "🇬🇷", description: "Charred Souvlaki, Fresh Horiatiki Salad, Baked Moussaka & Honey Baklava" },
  { strArea: "Spanish", flag: "🇪🇸", description: "Valencian Seafood Paella, Garlic Gambas Tapas & Cinnamon Churros" },
  { strArea: "Turkish", flag: "🇹🇷", description: "Smoky Adana Kebabs, Crispy Boat Pide, Rich Mezze & Pistachio Baklava" },
  { strArea: "Moroccan", flag: "🇲🇦", description: "Slow-Braised Tagines, Fragrant Seven Vegetable Couscous & Pastilla" },
  { strArea: "Canadian", flag: "🇨🇦", description: "Authentic Cheese Curd Poutine, Tourtière & Pure Maple Butter Tarts" },
  { strArea: "Vietnamese", flag: "🇻🇳", description: "Aromatic Beef & Chicken Pho, Crispy Banh Mi & Fresh Summer Rolls" },
  { strArea: "Malaysian", flag: "🇲🇾", description: "Spicy Coconut Laksa, Smoky Chicken Satay & Fragrant Nasi Lemak" },
];

export const WORLD_CUISINE_CATEGORIES = [
  // ==========================================
  // 1. TAMIL NADU CATEGORIES
  // ==========================================
  {
    idCategory: "cat_tn_tiffin",
    strCategory: "Tamil Nadu Tiffin",
    strArea: "Tamil Nadu",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Masala_Dosa_02.jpg/960px-Masala_Dosa_02.jpg",
    strCategoryDescription: "Authentic South Indian & Tamil breakfast favorites, dosas, idlis, and crispy vadai.",
  },
  {
    idCategory: "cat_biryani_rice",
    strCategory: "Biryani & Rice",
    strArea: "Tamil Nadu",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyderabadi_Chicken_Biryani.jpg/960px-Hyderabadi_Chicken_Biryani.jpg",
    strCategoryDescription: "Fragrant Seeraga Samba and Basmati biryanis, variety rices, and traditional meals.",
  },
  {
    idCategory: "cat_tamil_curries",
    strCategory: "Tamil Curries & Gravies",
    strArea: "Tamil Nadu",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/ChickenChettinad.JPG/960px-ChickenChettinad.JPG",
    strCategoryDescription: "Rich Chettinad gravies, spicy kulambu varieties, and traditional home-style curries.",
  },
  {
    idCategory: "cat_parotta_breads",
    strCategory: "Parottas & Breads",
    strArea: "Tamil Nadu",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Parotta_With_Mutton_gravey.jpg/960px-Parotta_With_Mutton_gravey.jpg",
    strCategoryDescription: "Flaky Madurai bun parottas, spicy kothu parotta, soft tandoori rotis, and garlic naans.",
  },
  {
    idCategory: "cat_starters_snacks",
    strCategory: "Starters & Snacks",
    strArea: "Tamil Nadu",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Chicken_65_%28Dish%29.jpg/960px-Chicken_65_%28Dish%29.jpg",
    strCategoryDescription: "Crispy Chennai 65, savory samosas, crunchy pakodas, and succulent spiced bites.",
  },
  {
    idCategory: "cat_desserts_sweets",
    strCategory: "Desserts & Sweets",
    strArea: "Tamil Nadu",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Mysore_pak.jpg/960px-Mysore_pak.jpg",
    strCategoryDescription: "Iruttu Kadai Halwa, melting Mysore Pak, hot Gulab Jamuns, and rich Payasam varieties.",
  },
  {
    idCategory: "cat_beverages_soups",
    strCategory: "Beverages & Soups",
    strArea: "Tamil Nadu",
    strCategoryThumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Indian_filter_coffee_in_Dabarah.jpg/960px-Indian_filter_coffee_in_Dabarah.jpg",
    strCategoryDescription: "Madras Filter Degree Coffee, Madurai Jigarthanda, Nannari Sarbath, and hot Nattu Kozhi soup.",
  },

  // ==========================================
  // 2. NORTH INDIAN CATEGORIES
  // ==========================================
  {
    idCategory: "cat_north_curries",
    strCategory: "North Indian Curries & Gravies",
    strArea: "North Indian",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Chicken_makhani.jpg/960px-Chicken_makhani.jpg",
    strCategoryDescription: "Rich creamy makhani gravies, aromatic paneer specials, dal makhani and royal shahi curries.",
  },
  {
    idCategory: "cat_north_tandoori",
    strCategory: "Tandoori & Starters",
    strArea: "North Indian",
    strCategoryThumb: tandooriStartersImg,
    strCategoryDescription: "Smoky clay oven tandoori chicken, paneer tikka, malai soya chaap, and crispy Punjabi samosas.",
  },
  {
    idCategory: "cat_north_breads",
    strCategory: "Naan, Roti & Parathas",
    strArea: "North Indian",
    strCategoryThumb: butterNaanImg,
    strCategoryDescription: "Fluffy butter garlic naans, Amritsari aloo parathas, tandoori rotis, and layered kulchas.",
  },
  {
    idCategory: "cat_north_mithai",
    strCategory: "North Indian Mithai",
    strArea: "North Indian",
    strCategoryThumb: northMithaiImg,
    strCategoryDescription: "Spongy Kesar Rasmalai, hot Gulab Jamun with rabdi, silver kaju katli, and royal badam halwa.",
  },

  // ==========================================
  // 3. ITALIAN CATEGORIES
  // ==========================================
  {
    idCategory: "cat_italian_pasta",
    strCategory: "Italian Pasta & Risotto",
    strArea: "Italian",
    strCategoryThumb: italianPastaImg,
    strCategoryDescription: "Silky Spaghetti Carbonara, creamy Fettuccine Alfredo, spicy Penne all'Arrabbiata and Truffle Risotto.",
  },
  {
    idCategory: "cat_italian_pizza",
    strCategory: "Italian Pizzas & Breads",
    strArea: "Italian",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
    strCategoryDescription: "Wood-fired Neapolitan Margherita, herb focaccia, garlic bruschetta, and folded calzones.",
  },
  {
    idCategory: "cat_italian_mains",
    strCategory: "Italian Mains & Meats",
    strArea: "Italian",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg",
    strCategoryDescription: "Crispy Chicken Parmigiana, Osso Buco alla Milanese, Tuscan butter salmon, and rich Lasagna.",
  },
  {
    idCategory: "cat_italian_dessert",
    strCategory: "Italian Desserts",
    strArea: "Italian",
    strCategoryThumb: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    strCategoryDescription: "Espresso Tiramisu, vanilla bean Panna Cotta with berries, crisp Sicilian Cannoli, and artisanal Gelato.",
  },

  // ==========================================
  // 4. CHINESE CATEGORIES
  // ==========================================
  {
    idCategory: "cat_chinese_noodles",
    strCategory: "Chinese Noodles & Fried Rice",
    strArea: "Chinese",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
    strCategoryDescription: "Sizzling Lo Mein, spicy Sichuan Dan Dan noodles, wok Chow Mein, and fragrant Yang Chow fried rice.",
  },
  {
    idCategory: "cat_chinese_dimsum",
    strCategory: "Chinese Dim Sum & Starters",
    strArea: "Chinese",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Xiaolongbao-shanghai.jpg/960px-Xiaolongbao-shanghai.jpg",
    strCategoryDescription: "Crispy vegetable spring rolls, steamed dumplings, pork wontons in chili oil, and scallion pancakes.",
  },
  {
    idCategory: "cat_chinese_wok",
    strCategory: "Chinese Wok Mains",
    strArea: "Chinese",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/1525872624.jpg",
    strCategoryDescription: "Kung Pao Chicken, sweet and sour crispy chicken, tender beef with broccoli, Mapo Tofu, and Peking duck.",
  },
  {
    idCategory: "cat_chinese_soups",
    strCategory: "Chinese Soups & Broths",
    strArea: "Chinese",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/1529445434.jpg",
    strCategoryDescription: "Traditional hot & sour soup, silky egg drop soup, and delicate handmade wonton dumpling broths.",
  },

  // ==========================================
  // 5. MEXICAN CATEGORIES
  // ==========================================
  {
    idCategory: "cat_mexican_tacos",
    strCategory: "Mexican Tacos & Fajitas",
    strArea: "Mexican",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/960px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
    strCategoryDescription: "Carne Asada street tacos, Baja crispy fish tacos, sizzling chicken fajitas, and juicy Birria tacos.",
  },
  {
    idCategory: "cat_mexican_burritos",
    strCategory: "Mexican Enchiladas & Burritos",
    strArea: "Mexican",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/vwrpps1503068729.jpg",
    strCategoryDescription: "Cheesy baked beef enchiladas, California mission burritos, golden chimichangas, and quesadillas.",
  },
  {
    idCategory: "cat_mexican_sides",
    strCategory: "Mexican Sides & Salsas",
    strArea: "Mexican",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Guacamole.jpg/960px-Guacamole.jpg",
    strCategoryDescription: "Fresh guacamole with tortilla chips, charbroiled Elote street corn, and slow-simmered Charro beans.",
  },
  {
    idCategory: "cat_mexican_dessert",
    strCategory: "Mexican Desserts",
    strArea: "Mexican",
    strCategoryThumb: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=80",
    strCategoryDescription: "Warm cinnamon sugar churros with chocolate, authentic Tres Leches cake, and creamy caramel flan.",
  },

  // ==========================================
  // 6. JAPANESE CATEGORIES
  // ==========================================
  {
    idCategory: "cat_japanese_ramen",
    strCategory: "Japanese Ramen & Noodles",
    strArea: "Japanese",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Ramen_Jump_002.jpg/960px-Ramen_Jump_002.jpg",
    strCategoryDescription: "Rich pork Tonkotsu ramen, Tokyo soy shoyu ramen, tempura udon, and stir-fried savory yaki soba.",
  },
  {
    idCategory: "cat_japanese_donburi",
    strCategory: "Japanese Donburi & Rice",
    strArea: "Japanese",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/d8f69b1599909838.jpg",
    strCategoryDescription: "Crispy Chicken Katsu curry rice, Gyudon sweet-soy beef bowls, and comforting soft egg Oyako donburi.",
  },
  {
    idCategory: "cat_japanese_sushi",
    strCategory: "Japanese Sushi & Tempura",
    strArea: "Japanese",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/g046bb1663484946.jpg",
    strCategoryDescription: "Golden crispy prawn tempura, fresh salmon avocado rolls, crunchy California rolls, and nigiri.",
  },
  {
    idCategory: "cat_japanese_snacks",
    strCategory: "Japanese Snacks & Sides",
    strArea: "Japanese",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Takoyaki_by_sowhat7_in_Tokyo.jpg/960px-Takoyaki_by_sowhat7_in_Tokyo.jpg",
    strCategoryDescription: "Crispy Osaka Takoyaki octopus balls, grilled chicken yakitori skewers, and pan-seared pork gyoza.",
  },

  // ==========================================
  // 7. AMERICAN CATEGORIES
  // ==========================================
  {
    idCategory: "cat_american_burgers",
    strCategory: "American Burgers & Sandwiches",
    strArea: "American",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/k29viq1585565941.jpg",
    strCategoryDescription: "Juicy double bacon cheeseburgers, hickory smoked pulled pork sandwiches, and Buffalo chicken burgers.",
  },
  {
    idCategory: "cat_american_bbq",
    strCategory: "American BBQ & Grills",
    strArea: "American",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/1529446352.jpg",
    strCategoryDescription: "Smoked Kansas BBQ ribs, crispy Buffalo chicken wings, charbroiled ribeye steaks, and roast meats.",
  },
  {
    idCategory: "cat_american_sides",
    strCategory: "American Comfort Sides",
    strArea: "American",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Macaroni_and_cheese.jpg/960px-Macaroni_and_cheese.jpg",
    strCategoryDescription: "Four-cheese baked macaroni, loaded bacon cheddar fries, creamy Southern coleslaw, and onion rings.",
  },
  {
    idCategory: "cat_american_pies",
    strCategory: "American Pies & Desserts",
    strArea: "American",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/yrstur1511816601.jpg",
    strCategoryDescription: "Warm cinnamon apple pie with flaky crust, classic New York baked cheesecake, and warm fudge brownies.",
  },

  // ==========================================
  // 8. FRENCH CATEGORIES
  // ==========================================
  {
    idCategory: "cat_french_mains",
    strCategory: "French Gourmet Mains",
    strArea: "French",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/vtqxtu1511784197.jpg",
    strCategoryDescription: "Slow-cooked Beef Bourguignon, Coq au Vin braised in red wine, duck confit, and Provencal ratatouille.",
  },
  {
    idCategory: "cat_french_soups",
    strCategory: "French Soups & Starters",
    strArea: "French",
    strCategoryThumb: frenchSoupsImg,
    strCategoryDescription: "Gruyère topped French onion soup, Marseillaise Bouillabaisse seafood stew, and warm Quiche Lorraine.",
  },
  {
    idCategory: "cat_french_pastries",
    strCategory: "French Pastries & Desserts",
    strArea: "French",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Cr%C3%A8me_br%C3%BBl%C3%A9e.jpg/960px-Cr%C3%A8me_br%C3%BBl%C3%A9e.jpg",
    strCategoryDescription: "Caramelized vanilla Crème Brûlée, dark chocolate soufflé, Crepes Suzette, and flaky butter croissants.",
  },

  // ==========================================
  // 9. THAI CATEGORIES
  // ==========================================
  {
    idCategory: "cat_thai_curries",
    strCategory: "Thai Curries",
    strArea: "Thai",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/sstssx1487349585.jpg",
    strCategoryDescription: "Aromatic Thai Green Curry with coconut milk, spicy Red Curry with chicken, and rich Massaman beef curry.",
  },
  {
    idCategory: "cat_thai_noodles",
    strCategory: "Thai Noodles & Rice",
    strArea: "Thai",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/uuuspp1468263334.jpg",
    strCategoryDescription: "Authentic Pad Thai with jumbo prawns, spicy drunken noodles (Pad Kee Mao), and pineapple fried rice.",
  },
  {
    idCategory: "cat_thai_soups",
    strCategory: "Thai Soups & Starters",
    strArea: "Thai",
    strCategoryThumb: thaiSoupsImg,
    strCategoryDescription: "Spicy lemongrass Tom Yum Goong soup, coconut chicken Tom Kha Gai, and golden Thai spring rolls.",
  },
  {
    idCategory: "cat_thai_desserts",
    strCategory: "Thai Desserts",
    strArea: "Thai",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Mango_and_sticky_rice.jpg/960px-Mango_and_sticky_rice.jpg",
    strCategoryDescription: "Sweet Mango Sticky Rice with rich coconut cream, and fragrant coconut tapioca pudding.",
  },

  // ==========================================
  // 10. BRITISH CATEGORIES
  // ==========================================
  {
    idCategory: "cat_british_classics",
    strCategory: "British Classics & Roasts",
    strArea: "British",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/vsqusq1487346051.jpg",
    strCategoryDescription: "Crispy beer-battered Fish & Chips with tartar sauce, Sunday Roast Beef with Yorkshire pudding.",
  },
  {
    idCategory: "cat_british_pies",
    strCategory: "British Savory Pies",
    strArea: "British",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/ud9sw51598739463.jpg",
    strCategoryDescription: "Slow-braised Steak and Ale pie, creamy chicken and leek pie, and traditional Cornish pasties.",
  },
  {
    idCategory: "cat_british_puddings",
    strCategory: "British Puddings & Sweets",
    strArea: "British",
    strCategoryThumb: britishPuddingsImg,
    strCategoryDescription: "Warm Sticky Toffee Pudding with butterscotch sauce, Victoria sponge cake, and bread & butter pudding.",
  },

  // ==========================================
  // 11. GREEK CATEGORIES
  // ==========================================
  {
    idCategory: "cat_greek_souvlaki",
    strCategory: "Greek Souvlaki & Gyros",
    strArea: "Greek",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/k420vi1585565244.jpg",
    strCategoryDescription: "Marinated charred pork souvlaki skewers, rolled gyros in warm pita with homemade garlic cucumber tzatziki.",
  },
  {
    idCategory: "cat_greek_mezze",
    strCategory: "Greek Mezze & Salads",
    strArea: "Greek",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Greek_salad.jpg/960px-Greek_salad.jpg",
    strCategoryDescription: "Crisp Horiatiki Greek village salad with creamy feta, Kalamata olives, dolmades, and roasted garlic hummus.",
  },
  {
    idCategory: "cat_greek_baked",
    strCategory: "Greek Baked Classics",
    strArea: "Greek",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/ctg8jd1585563097.jpg",
    strCategoryDescription: "Layered spiced beef and roasted eggplant Moussaka, flaky spinach Spanakopita, and comforting Pastitsio.",
  },
  {
    idCategory: "cat_greek_sweets",
    strCategory: "Greek Desserts & Pastries",
    strArea: "Greek",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Iraqi_food-Baklava_and_others.jpg/960px-Iraqi_food-Baklava_and_others.jpg",
    strCategoryDescription: "Golden honey-soaked walnut and pistachio baklava, Loukoumades honey donuts, and creamy Galaktoboureko.",
  },

  // ==========================================
  // 12. SPANISH CATEGORIES
  // ==========================================
  {
    idCategory: "cat_spanish_tapas",
    strCategory: "Spanish Tapas & Small Plates",
    strArea: "Spanish",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Patatas_bravas_01.jpg/960px-Patatas_bravas_01.jpg",
    strCategoryDescription: "Sizzling Gambas al Ajillo garlic prawns, crispy Patatas Bravas with spicy bravas sauce, and Spanish tortilla.",
  },
  {
    idCategory: "cat_spanish_paella",
    strCategory: "Spanish Paella & Rice",
    strArea: "Spanish",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/1520081754.jpg",
    strCategoryDescription: "Traditional saffron Valencian seafood paella with mussels, tiger prawns, calamari, and socarrat crust.",
  },
  {
    idCategory: "cat_spanish_mains",
    strCategory: "Spanish Mains & Meats",
    strArea: "Spanish",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/quuxvy1507350495.jpg",
    strCategoryDescription: "Slow-simmered Spanish Albóndigas meatballs in rich smoky tomato sauce, Iberian pork, and beef stews.",
  },
  {
    idCategory: "cat_spanish_sweets",
    strCategory: "Spanish Churros & Sweets",
    strArea: "Spanish",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Churros_con_chocolate_-_San_Gines.jpg/960px-Churros_con_chocolate_-_San_Gines.jpg",
    strCategoryDescription: "Crunchy Spanish churros dusted with sugar served with thick chocolate, and caramelized Crema Catalana.",
  },

  // ==========================================
  // 13. TURKISH CATEGORIES
  // ==========================================
  {
    idCategory: "cat_turkish_kebabs",
    strCategory: "Turkish Kebabs & Grills",
    strArea: "Turkish",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/58oia91564916529.jpg",
    strCategoryDescription: "Hand-minced spicy Adana lamb kebabs, succulent chicken shish, and Iskender kebab over pita bread.",
  },
  {
    idCategory: "cat_turkish_pide",
    strCategory: "Turkish Pide & Flatbreads",
    strArea: "Turkish",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Turkish_pide.jpg/960px-Turkish_pide.jpg",
    strCategoryDescription: "Stone-baked Turkish boat pides filled with spiced minced meat (Kıymalı) and bubbling Turkish Kashar cheese.",
  },
  {
    idCategory: "cat_turkish_mezze",
    strCategory: "Turkish Mezze & Dips",
    strArea: "Turkish",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Tzatziki_dip.jpg/960px-Tzatziki_dip.jpg",
    strCategoryDescription: "Smoky roasted eggplant Babaganoush, creamy yogurt Haydari with garlic and mint, and spicy Ezme salad.",
  },
  {
    idCategory: "cat_turkish_sweets",
    strCategory: "Turkish Baklava & Delights",
    strArea: "Turkish",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Iraqi_food-Baklava_and_others.jpg/960px-Iraqi_food-Baklava_and_others.jpg",
    strCategoryDescription: "Gaziantep pistachio baklava with 40 layers of delicate phyllo, stretchy cheese Künefe, and Turkish Delight.",
  },

  // ==========================================
  // 14. MOROCCAN CATEGORIES
  // ==========================================
  {
    idCategory: "cat_moroccan_tagines",
    strCategory: "Moroccan Tagines & Stews",
    strArea: "Moroccan",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/ryppsv1511815505.jpg",
    strCategoryDescription: "Clay pot lamb tagine with sweet apricots and toasted almonds, preserved lemon chicken tagine with green olives.",
  },
  {
    idCategory: "cat_moroccan_couscous",
    strCategory: "Moroccan Couscous Specials",
    strArea: "Moroccan",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg",
    strCategoryDescription: "Steamed fluffy semolina couscous piled high with seven seasonal vegetables, chickpeas, and aromatic spiced broth.",
  },
  {
    idCategory: "cat_moroccan_pastilla",
    strCategory: "Moroccan Pastilla & Starters",
    strArea: "Moroccan",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Chicken_pastilla.jpg/960px-Chicken_pastilla.jpg",
    strCategoryDescription: "Crispy warqa pastry Pastilla filled with spiced shredded poultry, almonds, and dusted with cinnamon sugar.",
  },

  // ==========================================
  // 15. CANADIAN CATEGORIES
  // ==========================================
  {
    idCategory: "cat_canadian_poutine",
    strCategory: "Canadian Poutine & Comfort Mains",
    strArea: "Canadian",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg",
    strCategoryDescription: "Hand-cut crispy fries topped with authentic Quebec squeaky cheese curds and rich steaming brown gravy.",
  },
  {
    idCategory: "cat_canadian_maple",
    strCategory: "Canadian Maple & Bakery Treats",
    strArea: "Canadian",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/1544384070.jpg",
    strCategoryDescription: "Flaky Quebec maple butter tarts with gooey caramel centres, Nanaimo bars, and warm maple pastries.",
  },

  // ==========================================
  // 16. VIETNAMESE CATEGORIES
  // ==========================================
  {
    idCategory: "cat_vietnamese_pho",
    strCategory: "Vietnamese Pho & Noodle Soups",
    strArea: "Vietnamese",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Pho-Beef-Noodles-2008.jpg/960px-Pho-Beef-Noodles-2008.jpg",
    strCategoryDescription: "Simmered 12-hour star anise beef Pho Bo, fragrant chicken Pho Ga, and spicy Hue lemongrass noodle soup.",
  },
  {
    idCategory: "cat_vietnamese_banhmi",
    strCategory: "Vietnamese Banh Mi & Rolls",
    strArea: "Vietnamese",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Banh_mi_thit.jpg/960px-Banh_mi_thit.jpg",
    strCategoryDescription: "Crispy baguette Banh Mi with lemongrass pork, pâté, pickled daikon & carrots, plus fresh summer salad rolls.",
  },

  // ==========================================
  // 17. MALAYSIAN CATEGORIES
  // ==========================================
  {
    idCategory: "cat_malaysian_laksa",
    strCategory: "Malaysian Laksa & Noodle Soups",
    strArea: "Malaysian",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/wai9bw1619788844.jpg",
    strCategoryDescription: "Rich and spicy Penang Curry Mee Laksa with coconut broth, tofu puffs, prawns, and boiled egg.",
  },
  {
    idCategory: "cat_malaysian_nasilemak",
    strCategory: "Malaysian Nasi Lemak & Curries",
    strArea: "Malaysian",
    strCategoryThumb: "https://www.themealdb.com/images/media/meals/wai9bw1619788844.jpg",
    strCategoryDescription: "Fragrant coconut rice Nasi Lemak served with spicy sambal ikan bilis, crispy fried chicken, and slow-cooked Beef Rendang.",
  },
  {
    idCategory: "cat_malaysian_satay",
    strCategory: "Malaysian Roti & Satay",
    strArea: "Malaysian",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Chicken_satay.jpg/960px-Chicken_satay.jpg",
    strCategoryDescription: "Char-grilled Malaysian chicken satay skewers with peanut sauce, and flaky buttery Roti Canai with dhal.",
  },

  // ==========================================
  // 18. PAKISTANI CATEGORIES
  // ==========================================
  {
    idCategory: "cat_pak_biryani",
    strCategory: "Pakistani Biryani & Karahi",
    strArea: "Pakistani",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Food-Beef-Biryani-1.jpg/960px-Food-Beef-Biryani-1.jpg",
    strCategoryDescription: "Aromatic spicy Karachi and Sindhi biryanis, iron wok simmered Lahori, Shinwari and Charsi karahis.",
  },
  {
    idCategory: "cat_pak_kebabs",
    strCategory: "Pakistani Kebabs & Tandoor",
    strArea: "Pakistani",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Seekh_Kebab.JPG/960px-Seekh_Kebab.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    strCategoryDescription: "Smoky charcoal-grilled Peshawari chapli kebabs, melt-in-mouth Lahori seekh, reshmi and gola skewers.",
  },
  {
    idCategory: "cat_pak_curries",
    strCategory: "Pakistani Slow-Cooked Stews & Curries",
    strArea: "Pakistani",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Nihari.JPG/960px-Nihari.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    strCategoryDescription: "Velvety Lahori beef nihari, slow-cooked mutton haleem, clay pot kunna gosht and chicken handi stews.",
  },
  {
    idCategory: "cat_pak_desserts",
    strCategory: "Pakistani Breads & Desserts",
    strArea: "Pakistani",
    strCategoryThumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Two_Gulab_Jamun_in_a_plate_01.jpg/960px-Two_Gulab_Jamun_in_a_plate_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    strCategoryDescription: "Sesame buttered roghani naans, royal saffron sheermal, traditional zarda, and warm gulab jamuns.",
  },
];

/**
 * Returns distinct categories specifically for the given cuisine / area.
 * If the area is listed in curated categories, returns those.
 * Otherwise, generates 5 distinct, well-structured categories for that area.
 */
export function getCategoriesForArea(areaName) {
  if (!areaName) return [];
  const normalized = areaName.toLowerCase().trim();

  const matched = WORLD_CUISINE_CATEGORIES.filter(
    (c) => (c.strArea || "").toLowerCase().trim() === normalized
  );

  if (matched.length > 0) {
    return matched;
  }

  // Dynamic fallback categories for other areas from TheMealDB (e.g. Filipino, Jamaican, Irish, etc.)
  const cleanArea = areaName.trim();
  return [
    {
      idCategory: `cat_${cleanArea.toLowerCase()}_mains`,
      strCategory: `${cleanArea} Traditional Mains`,
      strArea: cleanArea,
      strCategoryThumb: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      strCategoryDescription: `Authentic traditional ${cleanArea} main courses, slow-cooked specialties, and family recipes.`,
    },
    {
      idCategory: `cat_${cleanArea.toLowerCase()}_starters`,
      strCategory: `${cleanArea} Starters & Appetizers`,
      strArea: cleanArea,
      strCategoryThumb: "https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?auto=format&fit=crop&w=800&q=80",
      strCategoryDescription: `Popular ${cleanArea} street snacks, finger foods, fresh salads, and savory starters.`,
    },
    {
      idCategory: `cat_${cleanArea.toLowerCase()}_soups`,
      strCategory: `${cleanArea} Soups & Stews`,
      strArea: cleanArea,
      strCategoryThumb: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
      strCategoryDescription: `Hearty and comforting ${cleanArea} broths, slow-simmered stews, and warming soups.`,
    },
    {
      idCategory: `cat_${cleanArea.toLowerCase()}_breads`,
      strCategory: `${cleanArea} Breads & Rice Staples`,
      strArea: cleanArea,
      strCategoryThumb: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
      strCategoryDescription: `Heritage grain dishes, specialty breads, noodles, and flavorful rice preparations of ${cleanArea}.`,
    },
    {
      idCategory: `cat_${cleanArea.toLowerCase()}_sweets`,
      strCategory: `${cleanArea} Traditional Desserts`,
      strArea: cleanArea,
      strCategoryThumb: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
      strCategoryDescription: `Celebrated sweet treats, baked confections, and classic desserts from ${cleanArea}.`,
    },
  ];
}

/**
 * Intelligently classifies any meal from an area into that area's distinct categories.
 */
export function classifyMealCategory(meal, areaName) {
  if (!meal) return "Main Course";
  const name = (meal.strMeal || "").toLowerCase();
  const existingCat = (meal.strCategory || "").toLowerCase();
  const area = (areaName || meal.strArea || "").toLowerCase().trim();

  // 1. Italian
  if (area === "italian") {
    if (name.includes("pasta") || name.includes("spaghetti") || name.includes("carbonara") ||
        name.includes("risotto") || name.includes("lasagna") || name.includes("penne") ||
        name.includes("fettuccine") || name.includes("rigatoni") || name.includes("ravioli") ||
        name.includes("bolognese") || name.includes("tortellini") || existingCat.includes("pasta")) {
      return "Italian Pasta & Risotto";
    }
    if (name.includes("pizza") || name.includes("focaccia") || name.includes("bruschetta") ||
        name.includes("calzone") || name.includes("ciabatta") || name.includes("bread")) {
      return "Italian Pizzas & Breads";
    }
    if (name.includes("tiramisu") || name.includes("panna cotta") || name.includes("cannoli") ||
        name.includes("gelato") || name.includes("biscotti") || existingCat.includes("dessert") ||
        name.includes("cake") || name.includes("tart")) {
      return "Italian Desserts";
    }
    return "Italian Mains & Meats";
  }

  // 2. Chinese
  if (area === "chinese") {
    if (name.includes("noodle") || name.includes("lo mein") || name.includes("chow mein") ||
        name.includes("dan dan") || name.includes("fried rice") || name.includes("rice")) {
      return "Chinese Noodles & Fried Rice";
    }
    if (name.includes("dim sum") || name.includes("spring roll") || name.includes("dumpling") ||
        name.includes("wonton") || name.includes("potsticker") || name.includes("roll")) {
      return "Chinese Dim Sum & Starters";
    }
    if (name.includes("soup") || name.includes("broth") || name.includes("hot and sour") ||
        name.includes("egg drop")) {
      return "Chinese Soups & Broths";
    }
    return "Chinese Wok Mains";
  }

  // 3. Mexican
  if (area === "mexican") {
    if (name.includes("taco") || name.includes("fajita") || name.includes("birria") ||
        name.includes("carnitas") || name.includes("steak")) {
      return "Mexican Tacos & Fajitas";
    }
    if (name.includes("enchilada") || name.includes("burrito") || name.includes("quesadilla") ||
        name.includes("chimichanga")) {
      return "Mexican Enchiladas & Burritos";
    }
    if (name.includes("guacamole") || name.includes("salsa") || name.includes("elote") ||
        name.includes("beans") || name.includes("chips") || name.includes("nacho")) {
      return "Mexican Sides & Salsas";
    }
    if (name.includes("churro") || name.includes("flan") || name.includes("tres leches") ||
        existingCat.includes("dessert") || name.includes("cake")) {
      return "Mexican Desserts";
    }
    return "Mexican Tacos & Fajitas";
  }

  // 4. Japanese
  if (area === "japanese") {
    if (name.includes("ramen") || name.includes("udon") || name.includes("soba") ||
        name.includes("noodle")) {
      return "Japanese Ramen & Noodles";
    }
    if (name.includes("donburi") || name.includes("katsu") || name.includes("curry") ||
        name.includes("gyudon") || name.includes("rice")) {
      return "Japanese Donburi & Rice";
    }
    if (name.includes("sushi") || name.includes("tempura") || name.includes("roll") ||
        name.includes("sashimi")) {
      return "Japanese Sushi & Tempura";
    }
    if (name.includes("takoyaki") || name.includes("yakitori") || name.includes("gyoza") ||
        name.includes("edamame") || name.includes("snack")) {
      return "Japanese Snacks & Sides";
    }
    return "Japanese Donburi & Rice";
  }

  // 5. American
  if (area === "american") {
    if (name.includes("burger") || name.includes("sandwich") || name.includes("slider") ||
        name.includes("patty")) {
      return "American Burgers & Sandwiches";
    }
    if (name.includes("bbq") || name.includes("ribs") || name.includes("steak") ||
        name.includes("wings") || name.includes("brisket") || name.includes("roast")) {
      return "American BBQ & Grills";
    }
    if (name.includes("mac") || name.includes("fries") || name.includes("coleslaw") ||
        name.includes("onion ring") || name.includes("cornbread") || name.includes("salad")) {
      return "American Comfort Sides";
    }
    if (name.includes("pie") || name.includes("cheesecake") || name.includes("brownie") ||
        name.includes("cookie") || existingCat.includes("dessert") || name.includes("pancake")) {
      return "American Pies & Desserts";
    }
    return "American Burgers & Sandwiches";
  }

  // 6. French
  if (area === "french") {
    if (name.includes("soup") || name.includes("broth") || name.includes("quiche") ||
        name.includes("bouillabaisse") || name.includes("salad")) {
      return "French Soups & Starters";
    }
    if (name.includes("crème") || name.includes("creme") || name.includes("brûlée") ||
        name.includes("soufflé") || name.includes("croissant") || name.includes("crepe") ||
        name.includes("tart") || existingCat.includes("dessert")) {
      return "French Pastries & Desserts";
    }
    return "French Gourmet Mains";
  }

  // 7. Thai
  if (area === "thai") {
    if (name.includes("curry") || name.includes("gaeng") || name.includes("kaeng")) {
      return "Thai Curries";
    }
    if (name.includes("pad thai") || name.includes("noodle") || name.includes("fried rice") ||
        name.includes("khao pad")) {
      return "Thai Noodles & Rice";
    }
    if (name.includes("tom yum") || name.includes("tom kha") || name.includes("soup") ||
        name.includes("spring roll") || name.includes("satay")) {
      return "Thai Soups & Starters";
    }
    if (name.includes("mango") || name.includes("sticky rice") || existingCat.includes("dessert") ||
        name.includes("pudding")) {
      return "Thai Desserts";
    }
    return "Thai Curries";
  }

  // 8. British
  if (area === "british") {
    if (name.includes("pie") || name.includes("pasty") || name.includes("wellington") ||
        name.includes("pasties")) {
      return "British Savory Pies";
    }
    if (name.includes("toffee") || name.includes("pudding") || name.includes("custard") ||
        name.includes("crumble") || name.includes("tart") || name.includes("cake") ||
        name.includes("scone") || existingCat.includes("dessert")) {
      return "British Puddings & Sweets";
    }
    return "British Classics & Roasts";
  }

  // 9. Greek
  if (area === "greek") {
    if (name.includes("souvlaki") || name.includes("gyro") || name.includes("skewer")) {
      return "Greek Souvlaki & Gyros";
    }
    if (name.includes("salad") || name.includes("tzatziki") || name.includes("hummus") ||
        name.includes("feta") || name.includes("dip")) {
      return "Greek Mezze & Salads";
    }
    if (name.includes("baklava") || name.includes("honey") || existingCat.includes("dessert") ||
        name.includes("sweet")) {
      return "Greek Desserts & Pastries";
    }
    return "Greek Baked Classics";
  }

  // 10. Spanish
  if (area === "spanish") {
    if (name.includes("paella") || name.includes("rice") || name.includes("arroz")) {
      return "Spanish Paella & Rice";
    }
    if (name.includes("tapa") || name.includes("gambas") || name.includes("bravas") ||
        name.includes("croquette") || name.includes("tortilla")) {
      return "Spanish Tapas & Small Plates";
    }
    if (name.includes("churro") || name.includes("flan") || existingCat.includes("dessert") ||
        name.includes("crema catalana")) {
      return "Spanish Churros & Sweets";
    }
    return "Spanish Mains & Meats";
  }

  // 11. Turkish
  if (area === "turkish") {
    if (name.includes("kebab") || name.includes("kofta") || name.includes("kofte") ||
        name.includes("shish") || name.includes("grill")) {
      return "Turkish Kebabs & Grills";
    }
    if (name.includes("pide") || name.includes("bread") || name.includes("lahmacun") ||
        name.includes("borek")) {
      return "Turkish Pide & Flatbreads";
    }
    if (name.includes("mezze") || name.includes("baba") || name.includes("dip") ||
        name.includes("haydari") || name.includes("salad")) {
      return "Turkish Mezze & Dips";
    }
    if (name.includes("baklava") || name.includes("delight") || existingCat.includes("dessert") ||
        name.includes("sweet")) {
      return "Turkish Baklava & Delights";
    }
    return "Turkish Kebabs & Grills";
  }

  // 12. Moroccan
  if (area === "moroccan") {
    if (name.includes("couscous")) return "Moroccan Couscous Specials";
    if (name.includes("pastilla") || name.includes("soup") || name.includes("harira")) {
      return "Moroccan Pastilla & Starters";
    }
    return "Moroccan Tagines & Stews";
  }

  // 13. Canadian
  if (area === "canadian") {
    if (name.includes("maple") || name.includes("tart") || name.includes("sweet") ||
        existingCat.includes("dessert")) {
      return "Canadian Maple & Bakery Treats";
    }
    return "Canadian Poutine & Comfort Mains";
  }

  // 14. Vietnamese
  if (area === "vietnamese") {
    if (name.includes("pho") || name.includes("soup") || name.includes("noodle")) {
      return "Vietnamese Pho & Noodle Soups";
    }
    return "Vietnamese Banh Mi & Rolls";
  }

  // 15. Malaysian
  if (area === "malaysian") {
    if (name.includes("laksa") || name.includes("soup") || name.includes("mee")) {
      return "Malaysian Laksa & Noodle Soups";
    }
    if (name.includes("satay") || name.includes("roti") || name.includes("canai")) {
      return "Malaysian Roti & Satay";
    }
    return "Malaysian Nasi Lemak & Curries";
  }

  // 16. Pakistani
  if (area === "pakistani" || area === "pakistan") {
    if (name.includes("biryani") || name.includes("karahi") || name.includes("sajji") || name.includes("pulao")) {
      return "Pakistani Biryani & Karahi";
    }
    if (name.includes("kebab") || name.includes("kabab") || name.includes("tandoor") || name.includes("chargha") || name.includes("boti") || name.includes("tikka")) {
      return "Pakistani Kebabs & Tandoor";
    }
    if (name.includes("naan") || name.includes("roti") || name.includes("sheermal") || name.includes("taftan") || name.includes("halwa") || name.includes("zarda") || name.includes("jamun") || name.includes("tukda") || name.includes("kheer") || existingCat.includes("dessert")) {
      return "Pakistani Breads & Desserts";
    }
    return "Pakistani Slow-Cooked Stews & Curries";
  }

  // Default dynamic categorizer for any other area:
  const cleanArea = areaName ? areaName.trim() : "Regional";
  if (existingCat.includes("dessert") || name.includes("cake") || name.includes("pie") ||
      name.includes("pudding") || name.includes("tart") || name.includes("sweet") ||
      name.includes("ice cream")) {
    return `${cleanArea} Traditional Desserts`;
  }
  if (name.includes("soup") || name.includes("stew") || name.includes("broth") ||
      name.includes("chowder")) {
    return `${cleanArea} Soups & Stews`;
  }
  if (name.includes("salad") || name.includes("appetizer") || name.includes("starter") ||
      name.includes("dip") || name.includes("roll") || name.includes("finger")) {
    return `${cleanArea} Starters & Appetizers`;
  }
  if (name.includes("bread") || name.includes("rice") || name.includes("noodle") ||
      name.includes("roti") || name.includes("flatbread")) {
    return `${cleanArea} Breads & Rice Staples`;
  }

  return `${cleanArea} Traditional Mains`;
}
