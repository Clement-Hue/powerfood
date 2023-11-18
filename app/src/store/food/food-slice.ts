import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { FoodDictionary, UnidentifiedFood} from "@typing/app.type.ts";

type FoodState = {
    foods: FoodDictionary
    selectedFoodId: string | null
}

const initialState: FoodState = {
    foods: {},
    selectedFoodId: null
}

export default createSlice({
    name: "food",
    initialState,
    reducers: {
        foodsFetched(state, action: PayloadAction<FoodDictionary>) {
            state.foods = {...state.foods, ...action.payload}
        },
        foodsUpdated(state, {payload: {foodId, data}}: PayloadAction<{data: UnidentifiedFood, foodId: string}>) {
            state.foods[foodId] = {...data, id: foodId}
        },
        foodDeleted(state, {payload: {foodId}}: PayloadAction<{foodId: string}>) {
            delete state.foods[foodId];
        },
        foodSelected(state, {payload: {foodId}}: PayloadAction<{foodId: string}>) {
           state.selectedFoodId = foodId
        },
        foodUnselected(state) {
            state.selectedFoodId = null
        }
    },
})

