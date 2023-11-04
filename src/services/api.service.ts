import request from "./request.ts";
import {SearchResult} from "../types/api.type.ts";

function searchFood(food: string): Promise<SearchResult> {
    return request("v1/foods/search", {
        query: `&query=${food}&pageSize=10`
    })
}

export default {
    searchFood
}