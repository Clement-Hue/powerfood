import {FoodUnit, ValuesFor} from "@typing/app.type.ts";

export function getFoodUnit(valuesFor: ValuesFor): FoodUnit {
    return ({
       "100g": "g",
       "unit": "unit"
    }as const)[valuesFor]
}

export function getFoodUnitText(valuesFor: ValuesFor): string {
    return ({
        "100g": "100g",
        "unit": "unité"
    }as const)[valuesFor]
}

export function computeCalories(proteins: number, carbs: number, lipids: number) {
    return Math.ceil(proteins * 4 + carbs * 4 + lipids * 9)
}