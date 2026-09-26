// Comprehensive Culinary Translation Engine for Dishly Meal Explorer
// Fully translates 100% of ingredients, measurements, and cooking instructions
// Supports English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Malayalam (മലയാളം), Kannada (ಕನ್ನಡ), Spanish (Español), French (Français)

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
];

export const UI_TRANSLATIONS = {
  en: {
    ingredients: "Ingredients & Measurements",
    instructions: "Step-by-Step Cooking Instructions",
    checkOffHint: "Check off ingredients as you prepare them in your kitchen",
    copyList: "Copy Ingredients",
    copied: "Copied!",
    step: "Step",
    listen: "Listen",
    stop: "Stop",
    bilingual: "Bilingual Reference (Show English)",
    selectLanguage: "Language",
    readyIn: "Prep & Cook",
    serves: "Serves",
    videoTutorial: "Video Cooking Tutorial",
    translating: "Translating full recipe...",
    allIngredientsIncluded: "All ingredients & spices included for authentic taste",
    itemsCount: "items",
    stepsCount: "steps",
    cuisine: "Cuisine",
    category: "Category",
    allDone: "Recipe preparation complete! Enjoy your meal!",
  },
  ta: {
    ingredients: "தேவையான பொருட்கள் & அளவுகள்",
    instructions: "முழுமையான செய்முறை விளக்கம் (படிநிலைகள்)",
    checkOffHint: "சமையல் செய்யும் போது சேர்த்த பொருட்களை சரிபார்க்கவும்",
    copyList: "பொருட்களை நகலெடு",
    copied: "நகலெடுக்கப்பட்டது!",
    step: "படி",
    listen: "கேளுங்கள்",
    stop: "நிறுத்து",
    bilingual: "இருமொழி குறிப்பு (English உடன்)",
    selectLanguage: "மொழி தேர்வு",
    readyIn: "சமையல் நேரம்",
    serves: "பரிமாறும் அளவு",
    videoTutorial: "வீடியோ சமையல் பயிற்சி",
    translating: "முழு செய்முறையும் தமிழில் மொழிபெயர்க்கப்படுகிறது...",
    allIngredientsIncluded: "அனைத்து அத்தியாவசிய பொருட்களும் அளவுகளுடன் சேர்க்கப்பட்டுள்ளன",
    itemsCount: "பொருட்கள்",
    stepsCount: "படிநிலைகள்",
    cuisine: "உணவு பாரம்பரியம்",
    category: "வகை",
    allDone: "சமையல் முடிந்தது! சுவைத்து மகிழுங்கள்!",
  },
  ml: {
    ingredients: "ആവശ്യമായ ചേരുവകളും അളവുകളും",
    instructions: "പാചകരീതി (ഘട്ടം ഘട്ടമായി)",
    checkOffHint: "തയ്യാറാക്കുമ്പോൾ ചേരുവകൾ ഓരോന്നായി ടിക്ക് ചെയ്യുക",
    copyList: "ചേരുവകൾ പകർത്തുക",
    copied: "പകർത്തി!",
    step: "ഘട്ടം",
    listen: "കേൾക്കൂ",
    stop: "നിർത്തുക",
    bilingual: "ദ്വിഭാഷാ റഫറൻസ് (English ചേർത്ത്)",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    readyIn: "പാചക സമയം",
    serves: "വിളമ്പാൻ",
    videoTutorial: "വീഡിയോ പാചക ഗൈഡ്",
    translating: "മുഴുവൻ പാചകക്കുറിപ്പും മലയാളത്തിലേക്ക് മാറ്റുന്നു...",
    allIngredientsIncluded: "ഈ വിഭവത്തിനാവശ്യമായ എല്ലാ ചേരുവകളും ഉൾപ്പെടുത്തിയിട്ടുണ്ട്",
    itemsCount: "ചേരുവകൾ",
    stepsCount: "ഘട്ടങ്ങൾ",
    cuisine: "വിഭാഗം / രാജ്യം",
    category: "തരം",
    allDone: "പാചകം പൂർത്തിയായി! രുചികരമായി ആസ്വദിക്കൂ!",
  },
  hi: {
    ingredients: "आवश्यक सामग्री एवं माप",
    instructions: "पकाने की विधि (चरण-दर-चरण)",
    checkOffHint: "तैयारी करते समय सामग्री को टिक करते जाएं",
    copyList: "सामग्री कॉपी करें",
    copied: "कॉपी हो गया!",
    step: "चरण",
    listen: "सुनें",
    stop: "रोकें",
    bilingual: "द्विभाषी संदर्भ (English के साथ)",
    selectLanguage: "भाषा चुनें",
    readyIn: "पकने का समय",
    serves: "परोसें",
    videoTutorial: "वीडियो ट्यूटोरियल",
    translating: "पूरी विधि हिन्दी में अनुवादित हो रही है...",
    allIngredientsIncluded: "इस व्यंजन की सभी आवश्यक सामग्री और मसाले शामिल हैं",
    itemsCount: "सामग्री",
    stepsCount: "चरण",
    cuisine: "व्यंजन शैली",
    category: "श्रेणी",
    allDone: "व्यंजन तैयार है! स्वादिष्ट भोजन का आनंद लें!",
  },
  te: {
    ingredients: "కావలసిన పదార్థాలు & కొలతలు",
    instructions: "తయారీ విధానం (దశలవారీగా)",
    checkOffHint: "వంట చేస్తున్నప్పుడు పదార్థాలను టిక్ చేసుకోండి",
    copyList: "జాబితాను కాపీ చేయండి",
    copied: "కాపీ అయింది!",
    step: "దశ",
    listen: "వినండి",
    stop: "ఆపండి",
    bilingual: "ద్విభాషా సూచన (English తో)",
    selectLanguage: "భాషను ఎంచుకోండి",
    readyIn: "వంట సమయం",
    serves: "సర్వింగ్స్",
    videoTutorial: "వీడియో వంట గైడ్",
    translating: "వంట వివరాలు తెలుగులోకి అనువదించబడుతున్నాయి...",
    allIngredientsIncluded: "ఈ వంటకానికి అవసరమైన అన్ని పదార్థాలు పొందుపరచబడ్డాయి",
    itemsCount: "పదార్థాలు",
    stepsCount: "దశలు",
    cuisine: "వంటల శైలి",
    category: "వర్గం",
    allDone: "వంట పూర్తయింది! ఆస్వాదించండి!",
  },
  kn: {
    ingredients: "ಬೇಕಾಗುವ ಪದಾರ್ಥಗಳು ಮತ್ತು ಅಳತೆಗಳು",
    instructions: "ಮಾಡುವ ವಿಧಾನ (ಹಂತ-ಹಂತವಾಗಿ)",
    checkOffHint: "ಸಿದ್ಧಪಡಿಸುವಾಗ ಪದಾರ್ಥಗಳನ್ನು ಟಿಕ್ ಮಾಡಿ",
    copyList: "ಪಟ್ಟಿಯನ್ನು ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    step: "ಹಂತ",
    listen: "ಕೇಳಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    bilingual: "ದ್ವಿಭಾಷಾ ಉಲ್ಲೇಖ (English ನೊಂದಿಗೆ)",
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    readyIn: "ಅಡುಗೆ ಸಮಯ",
    serves: "ಸರ್ವಿಂಗ್ಸ್",
    videoTutorial: "ವೀಡಿಯೊ ಮಾರ್ಗದರ್ಶಿ",
    translating: "ಸಂಪೂರ್ಣ ಪಾಕವಿಧಾನ ಕನ್ನಡಕ್ಕೆ ಅನುವಾದವಾಗುತ್ತಿದೆ...",
    allIngredientsIncluded: "ಈ ಖಾದ್ಯಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಪದಾರ್ಥಗಳು ಒಳಗೊಂಡಿವೆ",
    itemsCount: "ಪದಾರ್ಥಗಳು",
    stepsCount: "ಹಂತಗಳು",
    cuisine: "ಆಹಾರ ಶೈಲಿ",
    category: "ವರ್ಗ",
    allDone: "ಅಡುಗೆ ಪೂರ್ಣಗೊಂಡಿದೆ! ಆನಂದಿಸಿ!",
  },
  es: {
    ingredients: "Ingredientes y Medidas",
    instructions: "Instrucciones de Cocina Paso a Paso",
    checkOffHint: "Marque los ingredientes a medida que los prepare",
    copyList: "Copiar Ingredientes",
    copied: "¡Copiado!",
    step: "Paso",
    listen: "Escuchar",
    stop: "Detener",
    bilingual: "Referencia Bilingüe (Mostrar Inglés)",
    selectLanguage: "Idioma",
    readyIn: "Tiempo",
    serves: "Porciones",
    videoTutorial: "Video Tutorial de Cocina",
    translating: "Traduciendo receta completa...",
    allIngredientsIncluded: "Todos los ingredientes y especias necesarios incluidos",
    itemsCount: "ingredientes",
    stepsCount: "pasos",
    cuisine: "Cocina",
    category: "Categoría",
    allDone: "¡Preparación completa! ¡Buen provecho!",
  },
  fr: {
    ingredients: "Ingrédients et Mesures",
    instructions: "Instructions de Cuisson Étape par Étape",
    checkOffHint: "Cochez les ingrédients au fur et à mesure de votre préparation",
    copyList: "Copier la Liste",
    copied: "Copié !",
    step: "Étape",
    listen: "Écouter",
    stop: "Arrêter",
    bilingual: "Référence Bilingue (Afficher Anglais)",
    selectLanguage: "Langue",
    readyIn: "Préparation",
    serves: "Portions",
    videoTutorial: "Tutoriel Vidéo",
    translating: "Traduction de la recette complète...",
    allIngredientsIncluded: "Tous les ingrédients et épices nécessaires sont inclus",
    itemsCount: "ingrédients",
    stepsCount: "étapes",
    cuisine: "Cuisine",
    category: "Catégorie",
    allDone: "Préparation terminée ! Bon appétit !",
  },
};

// In-memory cache for ultra-fast translations
const translationMemoryCache = new Map();

/**
 * Translates an array of text strings dynamically in batch using Google GTX API.
 * Uses `\n@@@\n` delimiter which preserves exact segment boundaries without translation distortion.
 */
export const translateBatchOnline = async (texts, targetLang) => {
  if (!texts || texts.length === 0 || targetLang === "en") {
    return texts;
  }

  // Check if all are already cached in memory
  const results = new Array(texts.length);
  const uncachedIndices = [];
  const uncachedTexts = [];

  texts.forEach((txt, idx) => {
    const trimmed = String(txt || "").trim();
    if (!trimmed) {
      results[idx] = "";
      return;
    }
    const memKey = `${targetLang}::${trimmed}`;
    if (translationMemoryCache.has(memKey)) {
      results[idx] = translationMemoryCache.get(memKey);
    } else {
      // Check localStorage
      try {
        const localVal = localStorage.getItem(`dt_${targetLang}_${trimmed.slice(0, 60)}`);
        if (localVal) {
          translationMemoryCache.set(memKey, localVal);
          results[idx] = localVal;
          return;
        }
      } catch {
        // ignore storage errors
      }
      uncachedIndices.push(idx);
      uncachedTexts.push(trimmed);
    }
  });

  if (uncachedIndices.length === 0) {
    return results;
  }

  // Translate in chunks if large, to respect URL length limits
  const CHUNK_SIZE = 15;
  for (let c = 0; c < uncachedTexts.length; c += CHUNK_SIZE) {
    const chunkTexts = uncachedTexts.slice(c, c + CHUNK_SIZE);
    const chunkIndices = uncachedIndices.slice(c, c + CHUNK_SIZE);

    const delimiter = "\n@@@\n";
    const joined = chunkTexts.join(delimiter);

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(joined)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let translatedFull = "";
      if (Array.isArray(data?.[0])) {
        translatedFull = data[0].map((chunk) => chunk[0] || "").join("");
      }

      const parts = translatedFull.split(/\s*@@@\s*/);

      chunkIndices.forEach((origIdx, i) => {
        const originalText = texts[origIdx];
        const translatedItem = (parts[i] !== undefined && parts[i].trim().length > 0)
          ? parts[i].trim()
          : originalText;

        results[origIdx] = translatedItem;

        // Cache in memory and localStorage
        const memKey = `${targetLang}::${String(originalText).trim()}`;
        translationMemoryCache.set(memKey, translatedItem);
        try {
          localStorage.setItem(`dt_${targetLang}_${String(originalText).trim().slice(0, 60)}`, translatedItem);
        } catch {
          // ignore
        }
      });
    } catch (err) {
      console.warn("Online translation request error:", err);
      // Fallback: keep original text
      chunkIndices.forEach((origIdx) => {
        results[origIdx] = texts[origIdx];
      });
    }
  }

  return results;
};

/**
 * Translates an entire meal recipe completely into the target language.
 * Translates:
 * 1. Each measurement ("1/4 cup", "2 tbsp", "500g")
 * 2. Each ingredient ("olive oil", "fermented dosa batter", "garlic")
 * 3. Each instruction step (full sentences, 100% in target language)
 */
export const translateCompleteRecipe = async (ingredients, instructions, targetLang) => {
  if (targetLang === "en" || !ingredients) {
    return {
      ingredients: (ingredients || []).map((item) => ({
        originalIngredient: item.ingredient,
        originalMeasure: item.measure,
        translatedIngredient: item.ingredient,
        translatedMeasure: item.measure,
      })),
      instructions: instructions || [],
      isTranslated: false,
    };
  }

  // Prepare lists for batch translation
  const measures = ingredients.map((i) => i.measure || "");
  const ingNames = ingredients.map((i) => i.ingredient || "");
  const stepTexts = instructions.map((s) => (typeof s === "string" ? s : s.text || ""));

  const allToTranslate = [...measures, ...ingNames, ...stepTexts];

  const translatedAll = await translateBatchOnline(allToTranslate, targetLang);

  const numIngs = ingredients.length;
  const translatedMeasures = translatedAll.slice(0, numIngs);
  const translatedIngNames = translatedAll.slice(numIngs, numIngs * 2);
  const translatedSteps = translatedAll.slice(numIngs * 2);

  const mappedIngredients = ingredients.map((item, idx) => ({
    originalIngredient: item.ingredient,
    originalMeasure: item.measure,
    translatedIngredient: translatedIngNames[idx] || item.ingredient,
    translatedMeasure: translatedMeasures[idx] || item.measure,
  }));

  return {
    ingredients: mappedIngredients,
    instructions: translatedSteps.length === instructions.length ? translatedSteps : instructions,
    isTranslated: true,
  };
};

/**
 * Speech synthesis helper: Read step aloud in the chosen language voice
 */
export const speakRecipeStep = (text, langCode, onEnd) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  window.speechSynthesis.cancel();

  const langLocales = {
    en: "en-US",
    ta: "ta-IN",
    hi: "hi-IN",
    te: "te-IN",
    ml: "ml-IN",
    kn: "kn-IN",
    es: "es-ES",
    fr: "fr-FR",
  };

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langLocales[langCode] || "en-US";
  utterance.rate = 0.95;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopSpeech = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
