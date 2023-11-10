import type {foodApiService} from "@services";
import handlers from "src/electron/handlers.ts"

export type ApiService = typeof handlers
export type FoodApiService = typeof foodApiService

export type Services = {
   apiService: ApiService
   foodApiService: FoodApiService
}