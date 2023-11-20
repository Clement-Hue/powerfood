import {RootState} from "@store";
import {createSelector} from "@reduxjs/toolkit";
import {Food, MealFoodDetails} from "@typing/app.type.ts";
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
        const res = {name: macroName, amount: 0}
        meals.forEach((meal) => {
            meal.foods.forEach((mf) => {
                const denominator = mf.food.valuesFor === "100g" ? 100 : 1
                res.amount += (mf.food[macroName] / denominator) * mf.amount
            })
        })
        return res;
    })
})

const selectMicros = createSelector(selectMeals, nutrientSelectors.selectNutrient, (meals, nutrients) => {
    return nutrients?.map((nutrient) => {
        const unit = nutrient.DRI.unit
        const amount = meals.reduce((prev, meal) => {
            meal.foods?.forEach((mf) => {
                const foodNutrient = mf.food.nutrients.find((n) => n.id === nutrient.id)
                const denominator = mf.food.valuesFor === "100g" ? 100 : 1
                if (foodNutrient) {
                    prev +=  (convert(foodNutrient.amount).from(foodNutrient.unit).to(unit) / denominator) * mf.amount
                }
            })
            return prev;
        }, 0) ?? 0;
        return {...nutrient, value: {amount, unit}}
    })
})

export default {
    selectDaysName,
    selectMeals,
    selectMacros,
    selectMicros
}