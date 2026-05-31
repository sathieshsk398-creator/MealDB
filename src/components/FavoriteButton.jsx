import React from "react";

const FavoriteButton = ({meal, onToggle, isFav }) => {
  return(
   <button
    onClick={(e) => {
    onToggle(meal);
   }}
    className={`cursor-pointer absolute right-2 top-1 py-1 px-2.5 rounded-full ${isFav ? "bg-red-500 text-white" : "bg-white/80 text-gray-700"} text-xl`}
    >
    {isFav ?"♥" : "♡"}
   </button>
  );
};

export default FavoriteButton;