
export interface Food {
    id: number; // Unique ID of the food.
    name: string; // The type of the food data.
    description?: string; // The description of the food.
    nutrients: Nutrient[];
}
export interface Nutrient {
    id: number;
    name: string;
    unit: string;
    value: number;
}
