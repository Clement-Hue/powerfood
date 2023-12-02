import { NutrientUnit, ValuesFor } from "./unit.type"

export type FoodsState = {
    [foodId: string]:  FoodState
} 

export type FoodState = {
    id: string
    name: string
    valuesFor: ValuesFor
    description?: string
    proteins: number
    lipids: number
    carbs: number
    calories: number
    nutrients: FoodNutrientState[] 
}

export type UnidentifiedFoodState = Omit<FoodState, "id">

export type FoodNutrientState = {
    id: string;
    unit: NutrientUnit;
    amount: number;
}

export type NutrientsState = {
    id: string
    name: string
    DRI: {
        amount: number,
        unit: NutrientUnit
    }
}

export type DaysState = {
    [dayName: string]: MealState[]
}

export type MealState = {
    id: string
    name: string
    foods: MealFoodState[]
}

export type MealFoodState = {
    id: string,
    amount: number
}

