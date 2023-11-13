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