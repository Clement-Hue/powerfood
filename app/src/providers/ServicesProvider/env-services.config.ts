import {apiService, foodApiService} from "@services";


export default {
    development: {
        apiService,
        foodApiService
    },
    production: {
        apiService,
        foodApiService
    }
}