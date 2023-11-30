export type FoodUnit = "g" | "unit"
export type NutrientUnit = "g" | "mcg" | "mg"
export type ValuesFor = "unit" | "100g"

export type DayDictionary = {
    [dayName: string]: Meal[]
}
export type FoodDictionary = {
    [foodId: string]: Food
}

type BaseFood = {
    id: string
    name: string
    valuesFor: ValuesFor
    description?: string
    proteins: number
    lipids: number
    carbs: number
    calories: number
}

export type Food = BaseFood & {
    nutrients: FoodNutrient[];
}

export type FoodDictionaryState = {
    [foodId: string]: BaseFood & { nutrients: { id: string, unit: NutrientUnit, amount: number }[] }
} 

export type UnidentifiedFood = Omit<Food, "id">

export type FoodNutrient = {
    id: string;
    /**
     * Name of nutrient
     */
    name: string;
    unit: NutrientUnit;
    amount: number;
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

export type Meal = {
    id: string
    name: string
    foods: MealFood[]
}

export type MealFood = {
    id: string,
    amount: number
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
