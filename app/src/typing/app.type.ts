export type FoodItem = {
    id: string
    name: string
    description?: string
    proteins: number
    lipids: number
    carbs: number
    calories: number
    nutrients: FoodNutrient[];
}
export type FoodDictionary = {
    [foodId: string]: FoodItem
}

export type FoodNutrient = {
    id: number;
    /**
     * Name of nutrient
     */
    name: string; // name of nutrient
    unit: Unit;
    amount: number;
}

export type NutrientInfo = {
    id: number
    name: string
    DRI: {
        amount: number,
        unit: Unit
    }
}

export type Unit = "g" | "mcg" | "mg"
export type MeasurementValue = {
    amount: number
    unit: Unit
}
export type UnidentifiedFood = Omit<FoodItem, "id">

export type Meal = {
    id: string
    name: string
    foods: MealFood[]
}

export type MealFoodDetails = {
    food: FoodItem
} & MeasurementValue

export type MealFood = {
    id: string,
    amount: number
    unit: Unit
}