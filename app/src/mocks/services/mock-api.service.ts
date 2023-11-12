import DRI from "@mocks/DRI.json"
import foods from "@mocks/foods.json"
import {NutrientInfo, FoodDictionary, NutrientUnit, UnidentifiedFood, MealFood} from "@typing/app.type.ts";
import {v4 as uuid} from "uuid"
import {DaySchema} from "@typing/schema.type.ts";

async function getNutrients() {
    return DRI as NutrientInfo[]
}
async function getFoods(): Promise<FoodDictionary> {
    return foods as FoodDictionary;
}

async function getDays(): Promise<DaySchema[]> {
    return [{name: "Jour par défaut"}]
}

async function addFood(_: UnidentifiedFood) {
    return uuid()
}

async function deleteFood(_: string) {
    return
}

// @ts-ignore
async function updateFood(foodId: string, data: UnidentifiedFood) {

}

// @ts-ignore
async function addMeal(dayName: string, mealName: string) {
    return uuid();
}

// @ts-ignore
async function deleteMeal(mealId: string) {
    return
}


// @ts-ignore
async function addFoodToMeal(mealId: string, foodId: string, {amount = 0, unit = "g"}: {amount: number, unit: NutrientUnit} = {} ) {
    return
}

// @ts-ignore
async function deleteFoodFromMeal(mealId: string, foodId: string) {
    return
}

// @ts-ignore
async function getMeals(dayName: string): Promise<MealFood[]> {
    return []
}

// @ts-ignore
async function updateFoodMeal(mealId: string, foodId: string, {amount = 0, unit = "g"}: {amount: number, unit: NutrientUnit} = {} ) {
    return
}

export default {
    getDays,
    getNutrients,
    getFoods,
    updateFoodMeal,
    getMeals,
    addFood,
    deleteFood,
    updateFood,
    addMeal,
    deleteMeal,
    addFoodToMeal,
    deleteFoodFromMeal,
}
