import {createSlice} from "@reduxjs/toolkit";

const initialState = {}

const nutrientSlice = createSlice({
    name: "nutrient",
    initialState,
    reducers: {

    }
})

export const {actions: nutrientActions} = nutrientSlice;
export default nutrientSlice.reducer;