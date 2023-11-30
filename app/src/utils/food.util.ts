import {FoodUnit, NutrientUnit, ValuesFor} from "@typing/app.type.ts";

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

export function getProteinsCalories(proteins: number) {
    return proteins * 4;
}
export function getLipidsCalories(lipids: number) {
    return lipids * 9;
}
export function getCarbsCalories(carbs: number) {
    return carbs * 4;
}

export function getCalories(proteins: number, carbs: number, lipids: number) {
    return getProteinsCalories(proteins) + getCarbsCalories(carbs) + getLipidsCalories(lipids)
}

/**
 * Mapping nutrient from api to the one saved in database
 * @Important: Missing iodin and b7 (biotin)
 * @param apiId
 */
export function apiNutrientMapping(apiId: number): {id: string, unit: NutrientUnit} | null {
    if (apiId === 301) {
        return {id: "min_calc", unit: "mg"}
    }
    if (apiId === 303) {
        return {id: "min_iron", unit: "mg"}
    }
    if (apiId === 304) {
        return {id: "min_mag", unit: "mg"}
    }
    if (apiId === 305) {
        return {id: "min_pho", unit: "mg"}
    }
    if (apiId === 306) {
        return {id: "min_pot", unit: "mg"}
    }
    if (apiId === 307) {
        return {id: "min_sod", unit: "mg"}
    }
    if (apiId === 309) {
        return {id: "min_zinc", unit: "mg"}
    }
    if (apiId === 312) {
        return {id: "min_cop", unit: "mg"}
    }
    if (apiId === 315) {
        return {id: "min_man", unit: "mg"}
    }
    if (apiId === 317) {
        return {id: "min_sel", unit: "mcg"}
    }
    if (apiId === 320) {
        return {id: "vit_a", unit: "mcg"}
    }
    if (apiId === 323) {
        return {id: "vit_e", unit: "mg"}
    }
    if (apiId === 326) {
        return {id: "vit_d", unit: "mcg"}
    }
    if (apiId === 401) {
        return {id: "vit_c", unit: "mg"}
    }
    if (apiId === 404) {
        return {id: "vit_b1", unit: "mg"}
    }
    if (apiId === 405) {
        return {id: "vit_b2", unit: "mg"}
    }
    if (apiId === 406) {
        return {id: "vit_b3", unit: "mg"}
    }
    if (apiId === 410) {
        return {id: "vit_b5", unit: "mg"}
    }
    if (apiId === 415) {
        return {id: "vit_b6", unit: "mg"}
    }
    if (apiId === 417) {
        return {id: "vit_b9", unit: "mcg"}
    }
    if (apiId === 418) {
        return {id: "vit_b12", unit: "mcg"}
    }
    if (apiId === 430) {
        return {id: "vit_k", unit: "mcg"}
    }
    return null;
}


export const displayAmount = (value?: number) => value?.toLocaleString("en-US", {maximumFractionDigits: 2})
