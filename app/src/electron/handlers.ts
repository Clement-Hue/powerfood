import {getAll, run, transaction} from "./db.ts";
import {
    FoodNutrientSchema,
    FoodSchema,
    NutrientSchema
} from "@typing/schema.type.ts";
import {NutrientUnit, ValuesFor} from "@typing/unit.type.ts";
import { DaysState, FoodsState, NutrientsState, UnidentifiedFoodState } from "@typing/store.type.ts";

async function getDays(): Promise<DaysState> {
    const res = await getAll<{
        day_name: string, meal_name: string, amount: number, food_id: number, meal_id: number
    }>(`
        SELECT d.name as day_name, m.name as meal_name, mf.amount, mf.food_id, m.id as meal_id FROM day d
        LEFT JOIN meal m ON m.day_name = d.name
        LEFT JOIN meal_food mf ON mf.meal_id = m.id
        ORDER BY m.id
    `);
    return res.reduce<DaysState>((prev, data) => {
        const oldMeal = prev[data.day_name]?.find((m) => m.id === String(data.meal_id))
        const food = {id: String(data.food_id), amount: data.amount}
        if (oldMeal) {
            oldMeal.foods.push(food)
            return prev;
        }
        prev[data.day_name] = [...(prev[data.day_name] ?? []), {id: String(data.meal_id), name: data.meal_name, foods: [food]}]
        return prev;
    }, {})
}

async function getNutrients(): Promise<NutrientsState[]> {
    const res = await getAll<NutrientSchema>("SELECT * FROM nutrient");
    return res.map(({id, name, dri_unit, dri_amount}) => ({
        id, name, DRI: {
            amount: dri_amount, unit: dri_unit as NutrientUnit
        }
    }))
}

async function getFoods(): Promise<FoodsState> {
    const foods = await getAll<FoodSchema & FoodNutrientSchema >( `
        SELECT f.*, fn.* FROM food f
        LEFT JOIN food_nutrient fn ON f.id = fn.food_id
    `);
    return foods.reduce<FoodsState>((prev, food) => {
        const prevFood = prev[String(food.id)]
        const nutrient = {id: food.nutrient_id,  unit: food.unit as NutrientUnit, amount: food.amount}
        if (prevFood) {
           prevFood.nutrients.push(nutrient);
           return prev;
        }
        return {...prev, [String(food.id)]: {id: String(food.id), name: food.name, carbs: food.carbs, calories: food.calories,
            proteins: food.proteins, lipids: food.lipids, description: food.description, valuesFor: food.values_for as ValuesFor,
            nutrients: [nutrient]
        }}
    }, {})
}

async function addFood(food: UnidentifiedFoodState) {
    return transaction(async () => {
        const id = await run(`
            INSERT INTO food (name, description, proteins, lipids, carbs, calories, values_for)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [food.name, food.description, food.proteins, food.lipids, food.carbs, food.calories, food.valuesFor]);
        await Promise.all(food.nutrients.map( (nutrient) => {
            return run(`
                INSERT INTO food_nutrient (food_id, nutrient_id, unit, amount)
                VALUES (?, ? ,? ,?) 
        `, [id, nutrient.id, nutrient.unit, nutrient.amount])
        }))
        return String(id);
    })
}

async function deleteFood(foodId: string) {
    await run("DELETE FROM food WHERE id = ?", [foodId])
}

async function deleteMeal(mealId: string) {
    await run("DELETE FROM meal WHERE id = ?", [mealId])
}

async function updateFood(foodId: string, food: UnidentifiedFoodState) {
    await transaction( () => {
        return Promise.all(
        [run(`
                UPDATE food SET name = ?, description = ?, proteins = ?, lipids = ?,
                carbs = ?, calories = ?, values_for = ?
                WHERE id = ?
            `, [food.name, food.description, food.proteins, food.lipids,
                food.carbs, food.calories, food.valuesFor, foodId]),
            ...food.nutrients.map((nutrient) => {
                return run(`
                    UPDATE food_nutrient SET unit = ?, amount = ?
                    WHERE food_id = ? AND nutrient_id = ?
                `, [nutrient.unit, nutrient.amount, foodId, nutrient.id])
                })
            ]
        )
    })
}

async function addMeal(dayName: string, mealName: string)  {
    const id = await run(
        "INSERT INTO meal (name, day_name) VALUES (?, ?)",
        [mealName, dayName]
    )
    return String(id);
}

async function addFoodToMeal(mealId: string, foodId: string, {amount = 0}: {amount?: number} = {} ) {
    await run(`
        INSERT INTO meal_food (meal_id, food_id, amount) VALUES (?, ?, ?)
        `,
        [mealId, foodId, amount]
    )
}

async function deleteFoodFromMeal(mealId: string, foodId: string) {
    await run("DELETE FROM meal_food WHERE meal_id = ? AND food_id = ?", [mealId, foodId])
}

async function updateFoodMeal(mealId: string, foodId: string, {amount}: {amount: number} ) {
    await run(`
        UPDATE meal_food SET amount = ?
        WHERE meal_id = ? AND food_id = ?
        `,
        [amount, mealId, foodId]
    )
}

export default {
    getDays,
    getNutrients,
    getFoods,
    addMeal,
    addFood,
    deleteFood,
    deleteMeal,
    updateFood,
    addFoodToMeal,
    deleteFoodFromMeal,
    updateFoodMeal
}
