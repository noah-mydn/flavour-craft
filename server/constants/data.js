// Dietary restrictions
const dietaryRestrictions = [
  {
    category: "Lifestyle Preferences",
    options: [
      { name: "Vegan" },
      { name: "Vegetarian" },
      { name: "Pescatarian" },
      { name: "Halal" },
      { name: "Kosher" },
    ],
  },
  {
    category: "Allergies and Intolerances",
    options: [
      { name: "Gluten-Free" },
      { name: "Dairy-Free" },
      { name: "Nut-Free" },
      { name: "Soy-Free" },
      { name: "Shellfish-Free" },
    ],
  },
  {
    category: "Health Conditions",
    options: [
      { name: "Diabetes-Friendly" },
      { name: "Hypertension-Friendly" },
      { name: "Low-Sodium" },
      { name: "Low-Sugar" },
      { name: "Low-Carb" },
      { name: "Heart-Healthy" },
      { name: "Kidney-Friendly" },
    ],
  },
];

const cuisinePreferences = [
  "Italian",
  "Japanese",
  "Chinese",
  "Mexican",
  "Indian",
  "Thai",
  "Burmese",
  "French",
  "Korean",
  "All",
];

module.exports = {
  cuisinePreferences,
  dietaryRestrictions,
};
