import {v4 as uuid} from "uuid"
import {getAll} from "./db.ts";

import {DaySchema, NutrientSchema} from "@typing/schema.type.ts";
import {Nutrient, Unit} from "@typing/app.type.ts";

async function getDays() {
    return getAll<DaySchema>("SELECT * FROM day");
}

async function getNutrients(): Promise<Nutrient[]> {
    const res = await getAll<NutrientSchema>("SELECT * FROM nutrient");
    return res.map(({id, name, dri_unit, dri_amount}) => ({
        id, name, DRI: {
            amount: dri_amount, unit: dri_unit as Unit
        }
    }))
}
async function addMeal(dayName: string, mealName: string)  {
    console.log(dayName, mealName)
    return uuid();
}

export default {
    getDays,
    addMeal,
    getNutrients
}
