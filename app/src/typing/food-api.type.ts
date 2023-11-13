export interface FoodInfo {
   food_name: string
   tag_name: string
   serving_qty: number
    photo: {
       thumb: string
    }
}
export interface SearchResult {
    common: FoodInfo[]
}

export interface GetFoodInfo {
    foods: FoodNutrient[]
}

export interface FoodNutrient {
   food_name: string
   serving_qty: number
   serving_unit: string
   serving_weight_grams: 100
   full_nutrients: {
       attr_id: number
        value: number
    }[]
    nf_calories: number
    nf_protein: number
    /**
     * Carbs
     */
    nf_total_carbohydrate: number
    /**
     * Lipids
     */
    nf_total_fat: number
}