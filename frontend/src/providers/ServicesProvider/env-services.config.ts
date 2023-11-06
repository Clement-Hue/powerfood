import {apiService, foodApiService} from "@services";
import {mockApiService} from "@mocks/services";


export default {
    development: {
        apiService: mockApiService,
        foodApiService
    },
    production: {
        apiService,
        foodApiService
    }
}