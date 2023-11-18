import {ApiService} from "@typing/internal.type.ts";
import {AppDispatch} from "@store";
import daySlice from "./day-slice.ts";

export default (apiService: ApiService) => ({
    daysFetched() {
        return async function (dispatch: AppDispatch) {
            const days = await apiService.getDays();
            dispatch(daySlice.actions.daysFetched({days: days.map((d) => d.name)}))
        }
    },
    mealsFetched({dayName}: {dayName: string}) {
        return async function (dispatch: AppDispatch) {
           const meals = await apiService.getMeals(dayName)
           dispatch(daySlice.actions.mealsFetched({dayName, meals}))
        }
    },
    mealAdded({dayName,mealName}: {dayName: string, mealName: string}) {
        return async function (dispatch: AppDispatch) {
            const id = await apiService.addMeal(dayName, mealName);
            dispatch(daySlice.actions.mealAdded({id, mealName, dayName}))
        }
    },
    mealDeleted({mealId, dayName}: {mealId: string, dayName: string}) {
        return async function (dispatch: AppDispatch) {
            await apiService.deleteMeal(mealId)
            dispatch(daySlice.actions.mealDeleted({dayName, mealId}))
        }
    },
    foodAddedToMeal({dayName,mealId, foodId, amount}: {dayName: string, mealId: string, foodId: string, amount: number}) {
        return async function (dispatch: AppDispatch) {
            await apiService.addFoodToMeal(mealId, foodId, {amount})
            dispatch(daySlice.actions.foodAddedToMeal({foodId, dayName, amount, mealId} ))
        }
    },
    foodRemovedFromMeal({dayName,mealId, foodId}: {dayName: string, mealId: string, foodId: string}) {
        return async function (dispatch: AppDispatch) {
            await apiService.deleteFoodFromMeal(mealId, foodId);
            dispatch(daySlice.actions.foodRemovedFromMeal({dayName, mealId, foodId}))
        }
    },
    foodUpdatedFromMeal({dayName, mealId, foodId, amount}: {dayName: string, mealId: string, foodId: string, amount: number}) {
        return async function (dispatch: AppDispatch) {
            await apiService.updateFoodMeal(mealId, foodId, {amount})
            dispatch(daySlice.actions.foodUpdatedFromMeal({dayName, mealId, foodId, amount}))
        }
    }
})
