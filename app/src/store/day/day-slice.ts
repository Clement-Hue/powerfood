import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DayDictionary, Meal} from "@typing/app.type.ts";

type DayState = {
    days: DayDictionary
}

const initialState: DayState = {
    days: {}
}

export default createSlice({
    name: "food",
    initialState,
    reducers: {
        daysFetched(state, {payload: {days}}: PayloadAction<{days: string[]}>) {
            days.forEach((dayName) => {
                state.days[dayName] = []
            })
        },
        mealsFetched(state, {payload: {dayName, meals = []}}: PayloadAction<{dayName: string, meals: Meal[]}>) {
            state.days[dayName] = meals;
        },
        mealAdded(state, {payload: {id, mealName, dayName}}: PayloadAction<{id: string, mealName: string, dayName: string}>) {
            state.days[dayName]?.push({id, name: mealName, foods: []})
        },
        mealDeleted(state, {payload: {mealId, dayName}}: PayloadAction<{mealId: string, dayName: string}>) {
            state.days[dayName] = state.days[dayName].filter((m) => m.id !== mealId)
        },
        foodAddedToMeal(state, {payload: {dayName, mealId, foodId, amount}}: PayloadAction<{dayName: string, mealId: string, foodId: string, amount: number}>) {
            const meal = state.days[dayName].find((m) => m.id === mealId)
            if (meal) {
                meal.foods.push({id: foodId, amount})
            }
        },
        foodRemovedFromMeal(state, {payload: {dayName, mealId, foodId}}: PayloadAction<{dayName: string, mealId: string, foodId: string}>) {
            const meal = state.days[dayName].find((m) => m.id === mealId)
            if (meal) {
               meal.foods = meal.foods.filter((f) => f.id !== foodId)
            }
        },
        foodUpdatedFromMeal(state, {payload: {dayName, mealId, foodId, amount}}: PayloadAction<{dayName: string, mealId: string, foodId: string, amount: number}>)  {
            const meal = state.days[dayName].find((m) => m.id === mealId)
            const food = meal?.foods.find((f) => f.id === foodId)
            if (food) {
                food.amount = amount;
            }
        }
    },
})

