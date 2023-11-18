import {useServices} from "./index.ts";
import {foodThunk} from "@store/food";
import {dayThunk} from "@store/day";

export default function () {
    const {apiService} = useServices()
    return {food: foodThunk(apiService), day: dayThunk(apiService)}
}