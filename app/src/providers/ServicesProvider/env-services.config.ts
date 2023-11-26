import {apiService, foodApiService, graphService} from "@services";


export default {
    development: {
        apiService,
        foodApiService,
        graphService
    },
    production: {
        apiService,
        foodApiService,
        graphService
    }
}
