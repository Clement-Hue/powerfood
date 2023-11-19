import {ApiService} from "@typing/internal.type.ts";
import {AppDispatch} from "@store";
import {nutrientActions} from "@store/nutrient/reducer.ts";

export default (apiService: ApiService) => ({
    nutrientFetched() {
        return async function (dispatch: AppDispatch) {
            const nutrients = await apiService.getNutrients();
            dispatch(nutrientActions.nutrientsFetched({nutrients}))
        }
    }
})