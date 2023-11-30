import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { NutrientsState } from "@typing/store.type";

type NutrientState = {
    nutrients?: NutrientsState[]
}

const initialState: NutrientState = {
}

const nutrientSlice = createSlice({
    name: "nutrient",
    initialState,
    reducers: {
        nutrientsFetched(state, {payload: {nutrients}}: PayloadAction<{nutrients: NutrientsState[]}>) {
           state.nutrients = nutrients;
        }
    }
})

export const {actions: nutrientActions} = nutrientSlice;
export default nutrientSlice.reducer;
