import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "@store";
import { nutrientSelectors } from "@store/nutrient";
import { FoodNutrient, FoodsDictionary } from "@typing/app.type";
import { FoodNutrientState } from "@typing/store.type";
import convert from "convert-units";


const selectFoods = createSelector((state: RootState) => state.food.foods, nutrientSelectors.selectNutrient, (foods, nutrients) => {
    const enrichNutrient = (foodNutrient: FoodNutrientState) => {
        const nutrient = nutrients?.find((n) => n.id === foodNutrient.id);
        if (!nutrient) {
            return {...foodNutrient, name: "", percentage: 0};
        }
        const amount = convert(foodNutrient.amount).from(foodNutrient.unit).to(nutrient.DRI.unit);
        const percentage = (amount / nutrient.DRI.amount) * 100;
        return {...foodNutrient, name: nutrient.name, percentage} as FoodNutrient;
    };
    return Object.fromEntries(Object.entries(foods).map(([id, food]) => {
        return [id, {...food, nutrients: food.nutrients.map<FoodNutrient>((foodNutrient) => {
            return enrichNutrient(foodNutrient)
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
