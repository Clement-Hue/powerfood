import type {foodApiService, graphService} from "@services";
import handlers from "src/electron/handlers.ts"

export type ApiService = typeof handlers
export type FoodApiService = typeof foodApiService
export type GraphService = typeof graphService

export type Services = {
   apiService: ApiService
   foodApiService: FoodApiService
   graphService: GraphService
}
