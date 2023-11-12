import {Food, FoodUnit} from "@typing/app.type.ts";

export function getFoodUnit(food: Food): FoodUnit {
    return ({
       "100g": "g",
       "unit": "unit"
    }as const)[food.valuesFor]
}