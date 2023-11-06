
export interface Food {
    id: number; // Unique ID of the food.
    name: string; // The type of the food data.
    description?: string; // The description of the food.
    proteins: number
    lipids: number
    carbs: number
    calories: number
    nutrients: FoodNutrient[];
}
export interface FoodNutrient {
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
        unit: "g" | "mcg" | "mg"
    }
}