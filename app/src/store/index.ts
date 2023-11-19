import {combineReducers, configureStore, PreloadedState} from '@reduxjs/toolkit'
import foodReducer from "@store/food";
import nutrientReducer from "@store/nutrient";
import dayReducer from "@store/day"

export const reducer= combineReducers({
        food: foodReducer,
        nutrient: nutrientReducer,
        day: dayReducer
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