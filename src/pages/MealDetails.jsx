import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Heart,
  ArrowLeft,
  Share2,
  Printer,
  Check,
  ExternalLink,
  ChefHat,
  Sparkles,
  Globe,
  Tag,
  Copy,
  Volume2,
  VolumeX,
  Languages,
  Loader2,
  BookOpen,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import { fetchMealsById } from "../api/mealdb";
import LoadingSpinner from "../components/LoadingSpinner";
import FavoriteButton from "../components/FavoriteButton";
import { getMealRating } from "../utils/price";
import { getCompleteRecipe } from "../data/fullRecipeDatabase";
import {
  SUPPORTED_LANGUAGES,
  UI_TRANSLATIONS,
  translateCompleteRecipe,
  speakRecipeStep,
  stopSpeech,
} from "../utils/recipeTranslations";

const MealDetails = () => {
  const { id } = useParams();
  const [mealData, setMealData] = useState({ meal: null, id: null });
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [shareNotice, setShareNotice] = useState(false);

  // Multilingual Recipe State (Default language is Tamil or previously selected; default bilingual is false for 100% pure selected language)
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("dishly_recipe_lang") || "ta";
  });
  const [bilingualMode, setBilingualMode] = useState(() => {
    const saved = localStorage.getItem("dishly_bilingual_mode");
    return saved === "true"; // default false so it is 100% in selected language without english mixing
  });

  // Dynamic Translation State for non-English languages
  const [translatedData, setTranslatedData] = useState({
    lang: null,
    mealId: null,
    ingredients: null,
    instructions: null,
    isTranslating: false,
  });

  // Audio / Speech Synthesis state
  const [speakingStep, setSpeakingStep] = useState(null);

  // Language Horizontal Scroll Navigation State
  const langScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkLangScroll = useCallback(() => {
    const el = langScrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    const el = langScrollRef.current;
    if (el) {
      checkLangScroll();
      el.addEventListener("scroll", checkLangScroll);
      window.addEventListener("resize", checkLangScroll);
      return () => {
        el.removeEventListener("scroll", checkLangScroll);
        window.removeEventListener("resize", checkLangScroll);
      };
    }
  }, [checkLangScroll]);

  const handleScrollLang = (direction) => {
    if (langScrollRef.current) {
      const scrollAmount = direction === "right" ? 220 : -220;
      langScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkLangScroll, 350);
    }
  };

  const { toggle, isFavorite } = useFavorites();

  useEffect(() => {
    let ignore = false;
    fetchMealsById(id)
      .then((res) => {
        if (!ignore) {
          setMealData({ meal: res.data.meals?.[0] || null, id });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("fetchMealsById error:", err);
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
      stopSpeech();
    };
  }, [id]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleLanguageChange = (code) => {
    stopSpeech();
    setSpeakingStep(null);
    setSelectedLanguage(code);
    localStorage.setItem("dishly_recipe_lang", code);
  };

  const handleBilingualToggle = () => {
    setBilingualMode((prev) => {
      const next = !prev;
      localStorage.setItem("dishly_bilingual_mode", String(next));
      return next;
    });
  };

  const isLoading = loading || mealData.id !== id;
  const meal = mealData.meal;

  // Extract guaranteed authentic and complete ingredients & instructions for the dish
  const completeRecipe = useMemo(() => {
    if (!meal) return { ingredients: [], instructions: [] };
    return getCompleteRecipe(meal);
  }, [meal]);

  // Dynamic online translation effect for non-English languages
  useEffect(() => {
    if (!meal || selectedLanguage === "en" || completeRecipe.ingredients.length === 0) {
      return;
    }

    let isCancelled = false;
    const currentMealId = meal.idMeal;

    // Trigger translation
    translateCompleteRecipe(
      completeRecipe.ingredients,
      completeRecipe.instructions,
      selectedLanguage
    )
      .then((res) => {
        if (isCancelled) return;
        setTranslatedData({
          lang: selectedLanguage,
          mealId: currentMealId,
          ingredients: res.ingredients.map((item, idx) => ({
            id: idx,
            originalIngredient: item.originalIngredient,
            originalMeasure: item.originalMeasure,
            displayIngredient: item.translatedIngredient || item.originalIngredient,
            displayMeasure: item.translatedMeasure || item.originalMeasure,
          })),
          instructions: res.instructions.map((stepText, idx) => ({
            stepNumber: idx + 1,
            originalText: completeRecipe.instructions[idx] || stepText,
            displayText: stepText,
          })),
          isTranslating: false,
        });
      })
      .catch((err) => {
        console.warn("Translation failed, using base recipe:", err);
        if (isCancelled) return;
        setTranslatedData({
          lang: selectedLanguage,
          mealId: currentMealId,
          ingredients: completeRecipe.ingredients.map((item, idx) => ({
            id: idx,
            originalIngredient: item.ingredient,
            originalMeasure: item.measure,
            displayIngredient: item.ingredient,
            displayMeasure: item.measure,
          })),
          instructions: completeRecipe.instructions.map((step, idx) => ({
            stepNumber: idx + 1,
            originalText: step,
            displayText: step,
          })),
          isTranslating: false,
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [meal, completeRecipe, selectedLanguage]);

  // Derive ingredients list
  const ingredientsList = useMemo(() => {
    if (
      selectedLanguage !== "en" &&
      translatedData.lang === selectedLanguage &&
      translatedData.mealId === meal?.idMeal &&
      translatedData.ingredients
    ) {
      return translatedData.ingredients;
    }
    return completeRecipe.ingredients.map((item, idx) => ({
      id: idx,
      originalIngredient: item.ingredient,
      originalMeasure: item.measure,
      displayIngredient: item.ingredient,
      displayMeasure: item.measure,
    }));
  }, [selectedLanguage, translatedData, meal, completeRecipe.ingredients]);

  // Derive instruction steps
  const instructionSteps = useMemo(() => {
    if (
      selectedLanguage !== "en" &&
      translatedData.lang === selectedLanguage &&
      translatedData.mealId === meal?.idMeal &&
      translatedData.instructions
    ) {
      return translatedData.instructions;
    }
    return completeRecipe.instructions.map((step, idx) => ({
      stepNumber: idx + 1,
      originalText: step,
      displayText: step,
    }));
  }, [selectedLanguage, translatedData, meal, completeRecipe.instructions]);

  const isTranslating =
    selectedLanguage !== "en" &&
    (translatedData.lang !== selectedLanguage || translatedData.mealId !== meal?.idMeal);

  // YouTube embed URL parser
  const youtubeEmbedUrl = useMemo(() => {
    if (!meal?.strYoutube) return null;
    const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = meal.strYoutube.match(regExp);
    return match && match[1]
      ? `https://www.youtube-nocookie.com/embed/${match[1]}`
      : null;
  }, [meal]);

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyIngredients = () => {
    if (!meal || ingredientsList.length === 0) return;
    const langUi = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;
    const text =
      `${meal.strMeal} - ${langUi.ingredients}\n\n` +
      ingredientsList
        .map((item) => {
          const measurePart = item.displayMeasure ? `${item.displayMeasure} ` : "";
          if (bilingualMode && selectedLanguage !== "en") {
            return `- ${measurePart}${item.displayIngredient} (${item.originalMeasure ? `${item.originalMeasure} ` : ""}${item.originalIngredient})`;
          }
          return `- ${measurePart}${item.displayIngredient}`;
        })
        .join("\n");

    navigator.clipboard?.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleToggleSpeakStep = useCallback(
    (stepNumber, text) => {
      if (speakingStep === stepNumber) {
        stopSpeech();
        setSpeakingStep(null);
      } else {
        setSpeakingStep(stepNumber);
        speakRecipeStep(text, selectedLanguage, () => {
          setSpeakingStep(null);
        });
      }
    },
    [speakingStep, selectedLanguage]
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: meal.strMeal,
        text: `Check out this recipe for ${meal.strMeal} on Dishly!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareNotice(true);
      setTimeout(() => setShareNotice(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentUi = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find(
    (l) => l.code === selectedLanguage
  );

  if (isLoading) return <LoadingSpinner />;

  if (!meal) {
    return (
      <div className="max-w-md mx-auto my-24 text-center px-4">
        <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-black text-slate-900 mb-2">Recipe Not Found</h1>
        <p className="text-slate-500 mb-6 text-sm">
          The recipe you requested could not be located or may have been removed.
        </p>
        <Link
          to="/"
          className="inline-block bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 text-sm"
        >
          Explore All Recipes
        </Link>
      </div>
    );
  }

  const rating = getMealRating(meal);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Breadcrumb Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 flex-wrap font-medium">
          <Link to="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-slate-300">/</span>
          {meal.strCategory && (
            <>
              <Link
                to={`/category/${encodeURIComponent(meal.strCategory)}`}
                className="hover:text-emerald-700 transition-colors"
              >
                {meal.strCategory}
              </Link>
              <span className="text-slate-300">/</span>
            </>
          )}
          {meal.strArea && (
            <>
              <Link
                to={`/cuisine/${encodeURIComponent(meal.strArea)}`}
                className="hover:text-emerald-700 transition-colors"
              >
                {meal.strArea}
              </Link>
              <span className="text-slate-300">/</span>
            </>
          )}
          <span className="text-slate-900 font-bold truncate max-w-xs">
            {meal.strMeal}
          </span>
        </nav>

        {/* Action Buttons: Save Favorite, Share, Print */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggle(meal)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
              isFavorite(meal.idMeal)
                ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-rose-600"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite(meal.idMeal) ? "fill-rose-500 text-rose-500" : "text-slate-400"
              }`}
            />
            <span>{isFavorite(meal.idMeal) ? "Saved in Favorites" : "Save Recipe"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer shadow-xs"
            title="Share recipe link"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{shareNotice ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer shadow-xs print:hidden"
            title="Print recipe guide"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Recipe Header Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Meal Image */}
          <div className="md:col-span-5 relative group">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-md border border-slate-100 relative">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton meal={meal} onToggle={toggle} isFav={isFavorite(meal.idMeal)} />
              </div>
            </div>

            {/* Diet type badge */}
            {meal.dietType && (
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    meal.dietType === "veg" ? "bg-emerald-600" : "bg-rose-600"
                  }`}
                />
                <span className={meal.dietType === "veg" ? "text-emerald-800" : "text-rose-800"}>
                  {meal.dietType === "veg" ? "Pure Vegetarian" : "Non-Vegetarian"}
                </span>
              </div>
            )}
          </div>

          {/* Meal Overview & Metadata */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Metadata Badges: Category, Cuisine/Area, Rating */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-emerald-700 text-white font-black px-2.5 py-1 rounded-lg shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{rating} Rating</span>
              </span>

              {meal.strCategory && (
                <Link
                  to={`/category/${encodeURIComponent(meal.strCategory)}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-semibold hover:bg-emerald-100 transition"
                >
                  <Tag className="w-3 h-3 text-emerald-600" />
                  <span>{meal.strCategory}</span>
                </Link>
              )}

              {meal.strArea && (
                <Link
                  to={`/cuisine/${encodeURIComponent(meal.strArea)}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-800 rounded-lg font-semibold hover:bg-blue-100 transition"
                >
                  <Globe className="w-3 h-3 text-blue-600" />
                  <span>{meal.strArea} Cuisine</span>
                </Link>
              )}
            </div>

            {/* Meal Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {meal.strMeal}
            </h1>

            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Authentic culinary preparation from {meal.strArea || "regional"} traditions. Follow the exact proportions and cooking instructions below to recreate this delicious dish.
            </p>

            {/* Recipe Highlights Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center mt-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                  {currentUi.ingredients}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
                  {ingredientsList.length} {currentUi.itemsCount || "items"}
                </span>
              </div>

              <div className="flex flex-col items-center border-x border-slate-200">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                  {currentUi.instructions}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
                  {instructionSteps.length} {currentUi.stepsCount || "steps"}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                  {currentUi.cuisine || "Cuisine"}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-800 mt-0.5 truncate max-w-[120px]">
                  {meal.strArea || "Authentic"}
                </span>
              </div>
            </div>

            {/* Video tutorial quick CTA */}
            {meal.strYoutube && (
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-red-600/20"
                >
                  <span>{currentUi.videoTutorial || "Watch Recipe Video"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-xs text-slate-500 font-medium">
                  Complete video cooking walkthrough
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MULTIPLE LANGUAGES SELECTOR TOOLBAR FOR INGREDIENTS & INSTRUCTIONS */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-800/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  <span>Recipe Language</span>
                  <span className="text-emerald-400 text-sm font-bold">
                    • {currentLangObj?.nativeName}
                  </span>
                </h3>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium">
                {currentUi.allIngredientsIncluded || "Select your language for 100% complete ingredients and cooking instructions"}
              </p>
            </div>
          </div>

          {/* Bilingual Toggle Switch (Optional, default is OFF so user gets 100% pure selected language) */}
          {selectedLanguage !== "en" && (
            <button
              type="button"
              onClick={handleBilingualToggle}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                bilingualMode
                  ? "bg-emerald-500/30 border-emerald-400/60 text-emerald-200 shadow-inner"
                  : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/15"
              }`}
              title="Show English original alongside translation"
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  bilingualMode ? "bg-emerald-400 border-emerald-300" : "border-slate-400"
                }`}
              >
                {bilingualMode && <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />}
              </div>
              <span>{currentUi.bilingual}</span>
            </button>
          )}
        </div>

        {/* Language Selection Bar with Navigation Arrows */}
        <div className="relative flex items-center gap-2 pt-1">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScrollLang("left")}
              className="shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm border border-white/20 active:scale-95"
              title="Previous languages"
              aria-label="Previous languages"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Scrollable Language Chips */}
          <div
            ref={langScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth flex-1"
          >
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-sm shrink-0 ${
                    isSelected
                      ? "bg-white text-emerald-950 font-black shadow-md scale-102 ring-2 ring-emerald-300"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  {lang.code !== "en" && (
                    <span
                      className={`text-[10px] uppercase font-bold opacity-80 ${
                        isSelected ? "text-emerald-700" : "text-emerald-200"
                      }`}
                    >
                      ({lang.name})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button for easy language selection */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScrollLang("right")}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md bg-white text-emerald-950 hover:bg-emerald-50 border border-white active:scale-95 font-black"
              title="Scroll for more languages"
              aria-label="More languages"
            >
              <span className="hidden sm:inline text-[11px] font-extrabold uppercase tracking-wider">More</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Translation Status Notice */}
        {isTranslating && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-800/60 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{currentUi.translating || "Translating entire recipe..."}</span>
          </div>
        )}
      </section>

      {/* Main Content: Ingredients and Cooking Instructions */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ingredients with Measurements & Interactive Checklist */}
        <section className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm sticky top-20">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>{currentLangObj?.nativeName || "Language"}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {currentUi.ingredients}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCopyIngredients}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg transition cursor-pointer"
              title="Copy ingredients checklist"
            >
              {copiedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentUi.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{currentUi.copyList}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-2 font-medium">
            {currentUi.checkOffHint}:
          </p>

          <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>{ingredientsList.length} {currentUi.itemsCount || "ingredients"} {currentUi.allIngredientsIncluded ? "• " + currentUi.allIngredientsIncluded : ""}</span>
          </div>

          <ul className="divide-y divide-slate-100 space-y-1">
            {ingredientsList.map((item) => {
              const isChecked = Boolean(checkedIngredients[item.id]);
              return (
                <li
                  key={item.id}
                  onClick={() => toggleIngredientCheck(item.id)}
                  className={`py-3 px-3 rounded-2xl flex items-start justify-between gap-3 text-sm cursor-pointer transition-colors ${
                    isChecked ? "bg-slate-50/80 opacity-60 line-through" : "hover:bg-slate-50 border border-transparent hover:border-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <span className="font-bold text-slate-800 block text-sm leading-snug break-words">
                        {item.displayIngredient}
                      </span>
                      {/* Bilingual original subtitle (only shown when user toggled bilingualMode ON) */}
                      {bilingualMode && selectedLanguage !== "en" && item.originalIngredient && (
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5 break-words">
                          {item.originalIngredient}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.displayMeasure && (
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block whitespace-nowrap">
                        {item.displayMeasure}
                      </span>
                      {bilingualMode &&
                        selectedLanguage !== "en" &&
                        item.originalMeasure &&
                        item.originalMeasure !== item.displayMeasure && (
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5 whitespace-nowrap">
                            {item.originalMeasure}
                          </span>
                        )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Right Column: Cooking Instructions & Video Player */}
        <section className="md:col-span-7 space-y-8">
          {/* Cooking Instructions Steps */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 uppercase tracking-widest">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>{currentLangObj?.nativeName} Guide</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {currentUi.instructions}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {instructionSteps.length} {currentUi.step}s
                </span>
                {speakingStep && (
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      setSpeakingStep(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition cursor-pointer"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>{currentUi.stop}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {instructionSteps.map((step) => {
                const isSpeakingThis = speakingStep === step.stepNumber;
                return (
                  <div
                    key={step.stepNumber}
                    className={`flex items-start gap-4 p-3.5 rounded-2xl transition-all duration-200 ${
                      isSpeakingThis
                        ? "bg-emerald-50/70 border border-emerald-200 ring-2 ring-emerald-300/40"
                        : "hover:bg-slate-50/60"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                        isSpeakingThis
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-emerald-600 group-hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {step.stepNumber}
                    </div>

                    <div className="flex-1 pt-0.5 space-y-1.5 min-w-0">
                      {/* Step Header with Text-to-Speech button */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                          {currentUi.step} {step.stepNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSpeakStep(step.stepNumber, step.displayText)
                          }
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                            isSpeakingThis
                              ? "bg-amber-100 text-amber-800"
                              : "text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                          }`}
                          title={`Listen to Step ${step.stepNumber} in ${currentLangObj?.name}`}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>
                            {isSpeakingThis ? currentUi.stop : currentUi.listen}
                          </span>
                        </button>
                      </div>

                      {/* 100% Translated Step Text */}
                      <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
                        {step.displayText}
                      </p>

                      {/* Bilingual Original English Step (only shown if user explicitly clicked Bilingual toggle) */}
                      {bilingualMode &&
                        selectedLanguage !== "en" &&
                        step.originalText !== step.displayText && (
                          <div className="pt-1.5 border-t border-slate-100 text-xs text-slate-500 font-normal leading-relaxed italic">
                            {step.originalText}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* YouTube / Video Section (Embedded player if available) */}
          {meal.strYoutube && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600" />
                    <span>{currentUi.videoTutorial || "Video Cooking Tutorial"}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Watch the chef demonstrate the preparation steps visually
                  </p>
                </div>

                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {youtubeEmbedUrl ? (
                <div className="rounded-2xl overflow-hidden shadow-inner border border-slate-200 aspect-video bg-black">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`${meal.strMeal} Cooking Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    Search and watch authentic recipe tutorials for this dish on YouTube.
                  </p>
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md shadow-red-600/20"
                  >
                    <span>Search Video Tutorials</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MealDetails;
