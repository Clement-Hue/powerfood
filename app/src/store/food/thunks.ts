import {ApiService} from "@typing/internal.type.ts";
import {AppDispatch} from "@store";
import foodSlice from "./food-slice.ts"
import {UnidentifiedFood} from "@typing/app.type.ts";

export default (apiService: ApiService) => ({
   foodsFetched() {
       return async function (dispatch: AppDispatch) {
           const foodDictionary = await apiService.getFoods();
           dispatch(foodSlice.actions.foodsFetched(foodDictionary))
       }
   },
    foodUpdated({foodId, data}: {foodId: string, data: UnidentifiedFood}) {
       return async function (dispatch: AppDispatch) {
           await apiService.updateFood(foodId, data);
           dispatch(foodSlice.actions.foodsUpdated({data, foodId}));
       }
    },
    foodAdded({data}: {data: UnidentifiedFood}) {
       return async function (dispatch: AppDispatch) {
           const foodId = await apiService.addFood(data);
           dispatch(foodSlice.actions.foodsUpdated({data, foodId}));
       }
    },
    foodDeleted({foodId}: {foodId: string}) {
       return async function (dispatch: AppDispatch) {
           await apiService.deleteFood(foodId);
           dispatch(foodSlice.actions.foodDeleted({foodId}))
       }
    }
})
