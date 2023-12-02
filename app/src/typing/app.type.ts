import { ValuesFor, NutrientUnit } from "./unit.type"

export type FoodsDictionary = {
    [foodId: string]: Food
}

export type Food =  {
    id: string
    name: string
    valuesFor: ValuesFor
    description?: string
    proteins: number
    lipids: number
    carbs: number
    calories: number
    nutrients: FoodNutrient[];
}


export type FoodNutrient = {
    id: string;
    /**
     * Name of nutrient
     */
    name: string;
    unit: NutrientUnit;
    amount: number;
    percentage: number;
}

export type NutrientInfo = {
    id: string
    name: string
    DRI: {
        amount: number,
        unit: NutrientUnit
    }
}

export type MeasurementValue<U = NutrientUnit> = {
    amount: number
    unit: U
}

export type MealFoodDetails = {
    food: Food
    amount: number
}

export type MicrosInfo = {
    foods: {
        food: Food;
        amount: number;
    }[];
    value: {
        unit: NutrientUnit;
        amount: number;
    };
    id: string;
    name: string;
    DRI: {
        amount: number;
        unit: NutrientUnit;
    };
}

export type MacrosInfo = {
    id: "proteins" | "lipids" | "carbs" | "calories";
    foods: {
        food: Food;
        amount: number;
    }[];
    amount: number;
}

export type MacrosCalories = {
    proteins: {
        calories: number;
        percentage: number;
    };
    carbs: {
        calories: number;
        percentage: number;
    };
    lipids: {
        calories: number;
        percentage: number;
    };
}
