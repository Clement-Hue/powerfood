import request from "./request.ts";
import {SearchResult} from "../typing/api.type.ts";

function searchFood(food: string, {pageNumber = 1} = {}): Promise<SearchResult> {
    return request("v1/foods/search", {
        query: `&query=${food}&pageSize=10&pageNumber=${pageNumber}`
    })
}

export default {
    searchFood
}