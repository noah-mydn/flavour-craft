import {
  BrunchDining as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  RamenDining as NightIcon,
} from "@mui/icons-material";
export const categoriesMap = {
  morning: [
    {
      label: "Breakfast",
      icon: <BreakfastIcon />,
      tags: ["Breakfast", "Brunch", "Smoothie", "Porridge", "Beverage"],
    },
  ],
  afternoon: [
    {
      label: "Lunch",
      icon: <LunchIcon />,
      tags: ["Lunch", "Rice Bowls", "Salad", "Soups", "Stir-Fry"],
    },
  ],
  evening: [
    {
      label: "Dinner",
      icon: <DinnerIcon />,
      tags: [
        "Dinner",
        "Comfort Food",
        "Main Course",
        "Noodles",
        "Pasta",
        "Barbecue",
      ],
    },
  ],
  night: [
    {
      label: "Late Night",
      icon: <NightIcon />,
      tags: [
        "Snack",
        "Dessert",
        "No-Bake",
        "Drinks",
        "Pizza Night",
        "Appetizer",
      ],
    },
  ],
};
