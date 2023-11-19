import {ApiService} from "@typing/internal.type.ts";
import {AppDispatch} from "@store";
import {foodActions} from "./reducer.ts"
import {UnidentifiedFood} from "@typing/app.type.ts";

export default (apiService: ApiService) => ({
   foodsFetched() {
       return async function (dispatch: AppDispatch) {
           const foodDictionary = await apiService.getFoods();
           dispatch(foodActions.foodsFetched(foodDictionary))
       }
   },
    foodUpdated({foodId, data}: {foodId: string, data: UnidentifiedFood}) {
       return async function (dispatch: AppDispatch) {
           await apiService.updateFood(foodId, data);
           dispatch(foodActions.foodsUpdated({data, foodId}));
       }
    },
    foodAdded({data}: {data: UnidentifiedFood}) {
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
