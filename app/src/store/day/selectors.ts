import {RootState} from "@store";
import {createSelector} from "@reduxjs/toolkit";
import {Food, MealFoodDetails} from "@typing/app.type.ts";

export default {
    selectDaysName: createSelector((state: RootState) => state.day.days,
        (days) => {
        return Object.keys(days)
    }),
    selectMeals: createSelector(
        (state: RootState, dayName: string) => state.day.days[dayName],
        (state: RootState) => state.food.foods,
        (meals = [], foods) => {
            return meals.map((meal) => {
                return {...meal, foods: meal.foods?.reduce<MealFoodDetails[]>((prev, mf) => {
                        const food: Food | undefined = foods[mf.id]
                        return !food ? prev : [...prev, {food, amount: mf.amount} ]
                    }, [])}
            })
    })
}