import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "@store";
import { nutrientSelectors } from "@store/nutrient";
import { FoodNutrient, FoodsDictionary } from "@typing/app.type";


const selectFoods = createSelector((state: RootState) => state.food.foods, nutrientSelectors.selectNutrient, (foods, nutrients) => {
    return Object.fromEntries(Object.entries(foods).map(([id, food]) => {
        return [id, {...food, nutrients: food.nutrients.map<FoodNutrient>((nutrient) => {
            return {...nutrient, name: nutrients?.find((n) => n.id === nutrient.id)?.name ?? "" }
        })}]
    })) as FoodsDictionary
})

const selectSelectedFood = createSelector(
    selectFoods,
    (state: RootState) => state.food.selectedFoodId,
    (foods, selectedFoodId) => {
        return selectedFoodId !== null ? foods[selectedFoodId] ?? null : null
})

export default {
    selectFoods,
    selectSelectedFood
}
