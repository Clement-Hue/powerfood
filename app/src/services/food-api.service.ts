import request from "./request.ts";
import {SearchResult} from "@typing/food-api.type.ts";

function searchFood(food: string): Promise<SearchResult> {
    return request("search/instant", {queries: {
            query: food
        }} );
}

export default {
    searchFood
}