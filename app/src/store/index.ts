import { configureStore } from '@reduxjs/toolkit'
import food from "@store/food.ts";
import nutrient from "@store/nutrient.ts";

const store = configureStore({
    reducer: {
        food: food.reducer,
        nutrient: nutrient.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;