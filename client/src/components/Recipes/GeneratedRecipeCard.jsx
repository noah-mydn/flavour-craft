import React from "react";
import { Clock, BookOpen, User, Heart } from "lucide-react";

const GeneratedRecipeCard = ({ recipes }) => {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">No recipes found</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <div
          key={recipe._id || index}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          {/* Recipe Image */}
          <div className="relative h-48 bg-gray-100">
            <img
              src={recipe.thumbnail || "../recipe-fallback-thumbnail.png"}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              {recipe.dietaryPreferences?.map((pref, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>

          {/* Recipe Content */}
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 text-gray-900 line-clamp-1">
              {recipe.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {recipe.shortDescription}
            </p>

            {/* Recipe Meta Info */}
            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={14} className="mr-1" />
                <span>{recipe.ingredients?.length || 0} ingredients</span>
              </div>
              <div className="flex items-center">
                <Heart size={14} className="mr-1" />
                <span>{recipe.saves || 0}</span>
              </div>
            </div>

            {/* Cuisine & Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {recipe.cuisineTypes?.map((cuisine, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full"
                >
                  {cuisine}
                </span>
              ))}
              {recipe.tags?.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneratedRecipeCard;
