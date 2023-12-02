import DRI from "@mocks/DRI.json"
import foods from "@mocks/foods.json"
import {v4 as uuid} from "uuid"
import {DaySchema} from "@typing/schema.type.ts";
import { NutrientUnit } from "@typing/unit.type"
import { FoodsState, NutrientsState, UnidentifiedFoodState } from "@typing/store.type";

async function getNutrients() {
    return DRI as NutrientsState[];
}
async function getFoods(): Promise<FoodsState> {
    return foods as FoodsState;
}

async function getDays(): Promise<DaySchema[]> {
    return [{name: "Jour par défaut"}]
}

async function addFood(_: UnidentifiedFoodState) {
    return uuid()
}

async function deleteFood(_: string) {
    return
}

// @ts-ignore
async function updateFood(foodId: string, data: UnidentifiedFoodState) {

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
async function updateFoodMeal(mealId: string, foodId: string, {amount = 0, unit = "g"}: {amount: number, unit: NutrientUnit} = {} ) {
    return
}

export default {
    getDays,
    getNutrients,
    getFoods,
    updateFoodMeal,
    addFood,
    deleteFood,
    updateFood,
    addMeal,
    deleteMeal,
    addFoodToMeal,
    deleteFoodFromMeal,
}
