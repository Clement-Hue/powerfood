import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "@store";

export default {
    selectFoods: createSelector((state: RootState) => state.food.foods,(foods) => {
       return foods;
    }),
    selectSelectedFoodId: createSelector((state: RootState) => state.food.selectedFoodId, (selectedFoodId) => {
        return selectedFoodId;
    })
}