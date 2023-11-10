import {v4 as uuid} from "uuid"
import type {apiService} from "@services";

const addMeal: typeof apiService["addMeal"] = async (dayName, mealName) => {
    console.log("call", dayName, mealName)
    return uuid();
}

export default {
    addMeal
}
