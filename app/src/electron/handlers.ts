import {getAll, run, transaction} from "./db.ts";
import {
    DaySchema,
    FoodNutrientSchema,
    FoodSchema,
    MealFoodSchema,
    MealSchema,
    NutrientSchema
} from "@typing/schema.type.ts";
import {Nutrient, Unit, Food, UnidentifiedFood, Meal, MealFood} from "@typing/app.type.ts";

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

async function updateFood(foodId: string, food: UnidentifiedFood) {
    await transaction( () => {
        return Promise.all(
        [run(`
                UPDATE food SET name = ?, description = ?, proteins = ?, lipids = ?,
                carbs = ?, calories = ?
                WHERE id = ?
            `, [food.name, food.description, food.proteins, food.lipids,
                food.carbs, food.calories, foodId]),
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

async function addFoodToMeal(mealId: string, foodId: string, {amount = 0, unit = "g"}: {amount?: number, unit?: Unit} = {} ) {
    await run(`
        INSERT INTO meal_food (meal_id, food_id, unit, amount) VALUES (?, ?, ?, ?)
        `,
        [mealId, foodId, unit, amount]
    )
}

async function deleteFoodFromMeal(mealId: string, foodId: string) {
    await run("DELETE FROM meal_food WHERE meal_id = ? AND food_id = ?", [mealId, foodId])
}

async function getMeals(dayName: string): Promise<Meal[]> {
   const res = await getAll<MealSchema>("SELECT * FROM meal WHERE day_name = ?", [dayName]);
   return res.map((meal) => ({
        id: String(meal.id), name: meal.name
    }))
}

// @ts-ignore
async function getMealFoods(mealId: string): Promise<MealFood[]> {
    const res = await getAll<MealFoodSchema>("SELECT * FROM meal_food WHERE meal_id = ?", [mealId])
    return res.map((mealFood) => ({
        id: String(mealFood.food_id), unit: mealFood.unit as Unit, amount: mealFood.amount
    }))
}

// @ts-ignore
async function updateFoodMeal(mealId: string, foodId: string, {amount = 0, unit = "g"}: {amount: number, unit: Unit} = {} ) {
    await run(`
        UPDATE meal_food SET unit = ?, amount = ?
        WHERE meal_id = ? AND food_id = ?
        `,
        [unit, amount, mealId, foodId]
    )
}

export default {
    getDays,
    getNutrients,
    getFoods,
    getMeals,
    getMealFoods,
    addMeal,
    addFood,
    deleteFood,
    deleteMeal,
    updateFood,
    addFoodToMeal,
    deleteFoodFromMeal,
    updateFoodMeal
}
