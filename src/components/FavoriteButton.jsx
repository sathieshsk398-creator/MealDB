import { Heart } from "lucide-react";

const FavoriteButton = ({ meal, onToggle, isFav, className = "" }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggle && meal) {
      onToggle(meal);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isFav
          ? `Remove ${meal?.strMeal || "dish"} from favorites`
          : `Add ${meal?.strMeal || "dish"} to favorites`
      }
      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
      className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-75 shadow-md backdrop-blur-md ${
        isFav
          ? "bg-rose-500 text-white hover:bg-rose-600 ring-2 ring-rose-300/60 shadow-rose-200"
          : "bg-white/90 text-gray-700 hover:text-rose-500 hover:bg-white"
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 ${
          isFav ? "fill-white stroke-white scale-110" : "stroke-[2.3] hover:scale-110"
        }`}
      />
    </button>
  );
};

export default FavoriteButton;