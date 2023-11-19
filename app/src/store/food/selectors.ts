import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "@store";

export default {
    selectFoods: createSelector((state: RootState) => state.food.foods,(foods) => {
       return foods;
    }),
    selectSelectedFood: createSelector(
        (state: RootState) => state.food.foods,
        (state: RootState) => state.food.selectedFoodId,
        (foods, selectedFoodId) => {
            return selectedFoodId !== null ? foods[selectedFoodId] ?? null : null
    })
}