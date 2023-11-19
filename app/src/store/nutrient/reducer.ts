import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {NutrientInfo} from "@typing/app.type.ts";

type NutrientState = {
    nutrients?: NutrientInfo[]
}

const initialState: NutrientState = {
}

const nutrientSlice = createSlice({
    name: "nutrient",
    initialState,
    reducers: {
        nutrientsFetched(state, {payload: {nutrients}}: PayloadAction<{nutrients: NutrientInfo[]}>) {
           state.nutrients = nutrients;
        }
    }
})

export const {actions: nutrientActions} = nutrientSlice;
export default nutrientSlice.reducer;