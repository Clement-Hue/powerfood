import DRI from "@mocks/DRI.json"
import foods from "@mocks/foods.json"
import {Food, Nutrient} from "@typing/app.type.ts";

async function getNutrients() : Promise<Nutrient[]>{
   return DRI as Nutrient[]
}

async function getFoods(): Promise<Food[]> {
   return foods as Food[];
}
export default {
   getNutrients,
   getFoods
}