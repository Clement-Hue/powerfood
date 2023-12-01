import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { UnidentifiedFood} from "@typing/app.type.ts";
import { FoodsState } from "@typing/store.type";

type FoodState = {
    foods: FoodsState
    selectedFoodId: string | null
}

const initialState: FoodState = {
    foods: {},
    selectedFoodId: null
}

const foodSlice = createSlice({
    name: "food",
    initialState,
    reducers: {
        foodsFetched(state, action: PayloadAction<FoodsState>) {
            state.foods = {...state.foods, ...action.payload}
        },
        foodsUpdated(state, {payload: {foodId, data}}: PayloadAction<{data: UnidentifiedFood, foodId: string}>){
            state.foods[foodId] = {...data, id: foodId}
        },
        foodDeleted(state, {payload: {foodId}}: PayloadAction<{foodId: string}>) {
            delete state.foods[foodId];
            if (state.selectedFoodId === foodId) {
                state.selectedFoodId = null;
            }
        },
        foodSelected(state, {payload: {foodId}}: PayloadAction<{foodId: string}>) {
            if (state.selectedFoodId === foodId) {
                state.selectedFoodId = null
            } else {
                state.selectedFoodId = foodId
            }
        },
    },
})

export const {actions: foodActions} = foodSlice;
export default foodSlice.reducer;
