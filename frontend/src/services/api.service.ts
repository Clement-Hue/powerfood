import DRI from "src/DRI.json"
import {Nutrient} from "@typing/app.type.ts";

async function getNutrients() : Promise<Nutrient[]>{
   return DRI as Nutrient[]
}
export default {
   getNutrients
}