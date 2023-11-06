
export type Food = {
    id: number; // Unique ID of the food.
    name: string; // The type of the food data.
    description?: string; // The description of the food.
    proteins: number
    lipids: number
    carbs: number
    calories: number
    nutrients: FoodNutrient[];
}

export type MealFood = Food & {
   amount: number
   unit: Unit
}
export type FoodNutrient = {
    id: number;
    name: string;
    unit: string;
    value: number;
}

export type Nutrient = {
    id: number
    name: string
    DRI: {
        amount: number,
        unit: Unit
    }
}

export type Unit = "g" | "mcg" | "mg"
export type Value = {
    amount: number
    unit: string
}