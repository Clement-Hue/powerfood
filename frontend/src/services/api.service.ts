import DRI from "@mocks/DRI.json"
import foods from "@mocks/foods.json"
import {Food, Nutrient, Unit} from "@typing/app.type.ts";

async function getNutrients() : Promise<Nutrient[]>{
   return DRI as Nutrient[]
}

async function getFoods(): Promise<Food[]> {
   return foods as Food[];
}
async function deleteFood(_: number) {
   return
}

// @ts-ignore
async function addMeal(dayName: string) {
   return
}

// @ts-ignore
async function deleteMeal(mealId: string) {
   return
}

// @ts-ignore
async function addFoodToMeal(mealId: string, foodId: number, {amount = 0, unit = "g"}: {amount: number, unit: Unit} = {} ) {
   return
}

// @ts-ignore
async function deleteFoodFromMeal(mealId: string, foodId: number) {
   return
}


export default {
   getNutrients,
   getFoods,
   deleteFood,
   addMeal,
   deleteMeal,
   addFoodToMeal,
   deleteFoodFromMeal
}