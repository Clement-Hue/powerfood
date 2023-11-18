import {combineReducers, configureStore, PreloadedState} from '@reduxjs/toolkit'
import food from "@store/food";
import nutrient from "@store/nutrient";
import day from "@store/day"

export const reducer= combineReducers({
        food: food.reducer,
        nutrient: nutrient.reducer,
        day: day.reducer
});
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer,
        preloadedState
    })
}
export type RootState = ReturnType<typeof reducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]

export default setupStore();