import {RootState} from "@store";
import {createSelector} from "@reduxjs/toolkit";
import {Food, MealFoodDetails, MicrosInfo} from "@typing/app.type.ts";
import {nutrientSelectors} from "@store/nutrient";
import convert from "convert-units";

const selectDaysName = createSelector((state: RootState) => state.day.days,
    (days) => {
        return Object.keys(days)
});

const selectMeals = createSelector(
    (state: RootState, dayName: string) => state.day.days[dayName],
    (state: RootState) => state.food.foods,
    (meals = [], foods) => {
        return meals.map((meal) => {
            return {...meal, foods: meal.foods?.reduce<MealFoodDetails[]>((prev, mf) => {
                    const food: Food | undefined = foods[mf.id]
                    return !food ? prev : [...prev, {food, amount: mf.amount} ]
                }, [])}
        })
});


const selectMacros = createSelector(selectMeals,(meals) => {
    return (["calories","proteins", "carbs", "lipids"] as const).map((macroName) => {
        const foods = meals.reduce<{food: Food, amount: number}[]>((prev, meal) => {
            meal.foods.forEach((mf) => {
                const denominator = mf.food.valuesFor === "100g" ? 100 : 1
                const amount = (mf.food[macroName] / denominator) * mf.amount;
                const existingFood = prev.find((f) => f.food.id === mf.food.id);
                if (existingFood) {
                    existingFood.amount += amount;
                } else {
                    prev.push({food: mf.food, amount });
                }
            })
            return prev;
        }, [])
        return {id: macroName, foods, amount: foods.reduce((prev, food) => (
            prev + food.amount
        ), 0) }
    })
})

const selectMicros = createSelector(selectMeals, nutrientSelectors.selectNutrient, (meals, nutrients) => {
    return nutrients?.map((nutrient) => {
        const unit = nutrient.DRI.unit
        const nutrientFoods = meals.reduce<{food: Food, amount: number}[]>((prev, meal) => {
            meal.foods?.forEach((mf) => {
                const foodNutrient = mf.food.nutrients.find((n) => n.id === nutrient.id)
                if (!foodNutrient || !foodNutrient.amount) {
                    return;
                }
                const denominator = mf.food.valuesFor === "100g" ? 100 : 1
                const amount = (convert(foodNutrient.amount).from(foodNutrient.unit).to(unit) / denominator) * mf.amount;
                const existingFood = prev.find((f) => f.food.id === mf.food.id);
                if (existingFood) {
                    existingFood.amount += amount;
                } else {
                    prev.push({food: mf.food, amount})
                } 
            })
            return prev;
        }, []) ?? [];
        return {...nutrient, foods: nutrientFoods, value: {unit, amount: nutrientFoods.reduce((prev, f) => prev + f.amount
        , 0)}} as MicrosInfo;
    })
})


export default {
    selectMicros, 
    selectDaysName,
    selectMeals,
    selectMacros,
}
