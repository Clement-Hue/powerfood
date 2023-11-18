import {RootState} from "@store";
import {createSelector} from "@reduxjs/toolkit";

export default {
    selectDaysName: createSelector((state: RootState) => state.day.days,
        (days) => {
        return Object.keys(days)
    }),
    selectMeals(state: RootState, dayName: string) {
        return state.day.days[dayName]
    }
}