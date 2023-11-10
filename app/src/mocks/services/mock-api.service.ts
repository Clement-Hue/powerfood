import DRI from "@mocks/DRI.json"
import foods from "@mocks/foods.json"
import {Nutrient, Food, Unit, UnidentifiedFood} from "@typing/app.type.ts";
import {v4 as uuid} from "uuid"

async function getNutrients() {
    return DRI as Nutrient[]
}
async function getFoods(): Promise<Food[]> {
    return foods as Food[];
}

async function getDays() {
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
async function addFoodToMeal(mealId: string, foodId: string, {amount = 0, unit = "g"}: {amount: number, unit: Unit} = {} ) {
    return
}

// @ts-ignore
async function deleteFoodFromMeal(mealId: string, foodId: string) {
    return
}

export default {
    getDays,
    getNutrients,
    getFoods,
    addFood,
    deleteFood,
    updateFood,
    addMeal,
    deleteMeal,
    addFoodToMeal,
    deleteFoodFromMeal,
}
