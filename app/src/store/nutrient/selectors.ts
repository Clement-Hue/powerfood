import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "@store";

export default {
    selectNutrient: createSelector(
        (state: RootState) => state.nutrient.nutrients,
        (nutrients) => {
        return nutrients;
    })
}