import DRI from "@mocks/DRI.json"
import foods from "@mocks/foods.json"
import {Food, Nutrient} from "@typing/app.type.ts";

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
async function deleteMeal(dayName: string, mealName: string) {
   return
}
export default {
   getNutrients,
   getFoods,
   deleteFood,
   addMeal,
   deleteMeal
}