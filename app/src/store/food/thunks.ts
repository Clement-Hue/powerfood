import {ApiService} from "@typing/internal.type.ts";
import {AppDispatch} from "@store";
import {foodActions} from "./reducer.ts"
import { UnidentifiedFoodState } from "@typing/store.type.ts";

export default (apiService: ApiService) => ({
   foodsFetched() {
       return async function (dispatch: AppDispatch) {
           const foodsState = await apiService.getFoods();
           dispatch(foodActions.foodsFetched(foodsState))
       }
   },
    foodUpdated({foodId, data}: {foodId: string, data: UnidentifiedFoodState}) {
       return async function (dispatch: AppDispatch) {
           await apiService.updateFood(foodId, data);
           dispatch(foodActions.foodsUpdated({data, foodId}));
       }
    },
    foodAdded({data}: {data: UnidentifiedFoodState}) {
       return async function (dispatch: AppDispatch) {
           const foodId = await apiService.addFood(data);
           dispatch(foodActions.foodsUpdated({data, foodId}));
       }
    },
    foodDeleted({foodId}: {foodId: string}) {
       return async function (dispatch: AppDispatch) {
           await apiService.deleteFood(foodId);
           dispatch(foodActions.foodDeleted({foodId}))
       }
    }
})
