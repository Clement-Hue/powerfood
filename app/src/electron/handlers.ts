import {v4 as uuid} from "uuid"

const addMeal = async (dayName: string, mealName: string) => {
    console.log(dayName, mealName)
    return uuid();
}

export default {
    addMeal
}
