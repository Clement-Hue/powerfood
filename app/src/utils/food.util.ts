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