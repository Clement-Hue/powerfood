import {ApiService} from "@typing/internal.type.ts";
import {AppDispatch} from "@store";
import {dayActions} from "./reducer.ts";

export default (apiService: ApiService) => ({
    daysFetched() {
        return async function (dispatch: AppDispatch) {
            const days = await apiService.getDays();
            dispatch(dayActions.daysFetched({days}))
        }
    },
    mealAdded({dayName,mealName}: {dayName: string, mealName: string}) {
        return async function (dispatch: AppDispatch) {
            const id = await apiService.addMeal(dayName, mealName);
            dispatch(dayActions.mealAdded({id, mealName, dayName}))
        }
    },
    mealDeleted({mealId, dayName}: {mealId: string, dayName: string}) {
        return async function (dispatch: AppDispatch) {
            await apiService.deleteMeal(mealId)
            dispatch(dayActions.mealDeleted({dayName, mealId}))
        }
    },
    foodAddedToMeal({dayName,mealId, foodId, amount}: {dayName: string, mealId: string, foodId: string, amount: number}) {
        return async function (dispatch: AppDispatch) {
            await apiService.addFoodToMeal(mealId, foodId, {amount})
            dispatch(dayActions.foodAddedToMeal({foodId, dayName, amount, mealId} ))
        }
    },
    foodRemovedFromMeal({dayName,mealId, foodId}: {dayName: string, mealId: string, foodId: string}) {
        return async function (dispatch: AppDispatch) {
            await apiService.deleteFoodFromMeal(mealId, foodId);
            dispatch(dayActions.foodRemovedFromMeal({dayName, mealId, foodId}))
        }
    },
    foodUpdatedFromMeal({dayName, mealId, foodId, amount}: {dayName: string, mealId: string, foodId: string, amount: number}) {
        return async function (dispatch: AppDispatch) {
            await apiService.updateFoodMeal(mealId, foodId, {amount})
            dispatch(dayActions.foodUpdatedFromMeal({dayName, mealId, foodId, amount}))
        }
    }
})
