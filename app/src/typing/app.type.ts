export type Food = {
    id: string
    name: string
    valuesFor: ValuesFor
    description?: string
    proteins: number
    lipids: number
    carbs: number
    calories: number
    nutrients: FoodNutrient[];
}

export type ValuesFor = "unit" | "100g"
export type FoodDictionary = {
    [foodId: string]: Food
}

export type FoodNutrient = {
    id: number;
    /**
     * Name of nutrient
     */
    name: string;
    unit: NutrientUnit;
    amount: number;
}

export type NutrientInfo = {
    id: number
    name: string
    DRI: {
        amount: number,
        unit: NutrientUnit
    }
}

export type NutrientUnit = "g" | "mcg" | "mg"
export type MeasurementValue<U = NutrientUnit> = {
    amount: number
    unit: U
}
export type UnidentifiedFood = Omit<Food, "id">

export type Meal = {
    id: string
    name: string
    foods: MealFood[]
}

export type MealFoodDetails = {
    food: Food
} & MeasurementValue<FoodUnit>

export type FoodUnit = "g" | "unit"

export type MealFood = {
    id: string,
} & MeasurementValue<FoodUnit>