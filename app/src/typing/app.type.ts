

export type Food = {
    id: string
    name: string
    description?: string
    proteins: number
    lipids: number
    carbs: number
    calories: number
    nutrients: FoodNutrient[];
}

export type FoodNutrient = {
    id: number;
    name: string;
    unit: Unit;
    amount: number;
}

export type Nutrient = {
    id: number
    name: string
    DRI: {
        amount: number,
        unit: Unit
    }
}

export type Unit = "g" | "mcg" | "mg"
export type Value = {
    amount: number
    unit: Unit
}
export type TotalNutrients = {
    [nutrientId: number]: Value
}

export type UnidentifiedFood = Omit<Food, "id">