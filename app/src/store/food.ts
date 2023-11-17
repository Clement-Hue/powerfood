import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchFood = createAsyncThunk(
    "food/fetch",
    async () => {
        console.log("call");
        return ""
    }
)

const initialState = {}

export default createSlice({
    name: "food",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchFood.fulfilled, () => {
            return {}
        })
    }
})

