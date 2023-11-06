import type {apiService, foodApiService} from "@services";

export type Services = {
   apiService: typeof apiService
   foodApiService: typeof foodApiService
}