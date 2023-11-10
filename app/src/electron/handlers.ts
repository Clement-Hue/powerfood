import {v4 as uuid} from "uuid"
import {getAll, run, transaction} from "./db.ts";

import {DaySchema, FoodNutrientSchema, FoodSchema, NutrientSchema} from "@typing/schema.type.ts";
import {Nutrient, Unit, Food, UnidentifiedFood} from "@typing/app.type.ts";

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

async function getFoods(): Promise<Food[]> {
    const foods = await getAll<FoodSchema & FoodNutrientSchema & {nutrient_name: string}>( `
        SELECT f.*, fn.*, n.name as nutrient_name FROM food f
        JOIN food_nutrient fn ON f.id = fn.food_id
        JOIN nutrient n ON n.id = fn.nutrient_id
    `);
    return foods.reduce<Food[]>((prev, food) => {
        const prevFood = prev.find((f) => Number(f.id) === food.id)
        const nutrient = {id: food.nutrient_id, name: food.nutrient_name, unit: food.unit as Unit, amount: food.amount}
        if (prevFood) {
           prevFood.nutrients.push(nutrient);
           return prev;
        }
        return [...prev, {id: String(food.id), name: food.name, carbs: food.carbs, calories: food.calories,
            proteins: food.proteins, lipids: food.lipids, description: food.description,
            nutrients: [nutrient]
        }]
    }, [])
}

async function addFood(food: UnidentifiedFood) {
    return transaction(async () => {
        const id = await run(`
            INSERT INTO food (name, description, proteins, lipids, carbs, calories)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [food.name, food.description, food.proteins, food.lipids, food.carbs, food.calories]);
        await Promise.all(food.nutrients.map( async (nutrient) => {
            await run(`
            INSERT INTO food_nutrient (food_id, nutrient_id, unit, amount)
            VALUES (?, ? ,? ,?)        
        `, [id, nutrient.id, nutrient.unit, nutrient.amount])
        }))
        return String(id);
    })
}
async function addMeal(dayName: string, mealName: string)  {
    const id = await run(
        "INSERT INTO meal (name, day_name) VALUES (?, ?)",
        [mealName, dayName]
    )
    return String(id);
}

export default {
    getDays,
    addMeal,
    getNutrients,
    getFoods,
    addFood
}
