import request from "./request.ts";
import {GetFoodInfo, SearchResult} from "@typing/food-api.type.ts";
import {ValuesFor} from "@typing/app.type.ts";

function getFoodInfo(food: string, valuesFor: ValuesFor): Promise<GetFoodInfo> {
    return request("natural/nutrients", {
            method: "POST",
            body: {
                query: `${valuesFor} ${food}`
            }
        }
    );
}
function searchFood(food: string): Promise<SearchResult> {
    return request("search/instant", {queries: {
            query: food,
            branded: false
        }} );
}

export default {
    searchFood,
    getFoodInfo
}