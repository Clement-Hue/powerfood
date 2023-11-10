// day table
export type DaySchema = {
    name: string
}

// nutrient table
export type NutrientSchema = {
   id: number
   name: string
   dri_amount: number
   dri_unit: string
}

// food table
export type FoodSchema = {
    id: number;
    name: string;
    description: string;
    proteins: number;
    lipids: number;
    carbs: number;
    calories: number;
};

// food_nutrient table
export type FoodNutrientSchema = {
    food_id: number;
    nutrient_id: number;
    unit: string;
    amount: number;
};

// meal table
export type MealSchema = {
    id: number;
    name: string;
    day_name: string;
};

// meal_food table
export type MealFoodSchema = {
    meal_id: number;
    food_id: number;
    unit: string;
    amount: number;
};
