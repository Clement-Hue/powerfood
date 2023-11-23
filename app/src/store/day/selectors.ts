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
const selectMicrosFoods = createSelector(selectMeals, nutrientSelectors.selectNutrient, (meals, nutrients) => {
    return nutrients?.map((nutrient) => {
        const unit = nutrient.DRI.unit
        const nutrientFoods = meals.reduce<{food: Food, amount: number}[]>((prev, meal) => {
            meal.foods?.forEach((mf) => {
                const foodNutrient = mf.food.nutrients.find((n) => n.id === nutrient.id)
                if (!foodNutrient) {
                    return;
                }
                const denominator = mf.food.valuesFor === "100g" ? 100 : 1
                const existingFood = prev.find((f) => f.food.id === mf.food.id);
                const amount = (convert(foodNutrient.amount).from(foodNutrient.unit).to(unit) / denominator) * mf.amount;
                if (existingFood) {
                    existingFood.amount += amount;
                } else {
                    prev.push({food: mf.food, amount})
                } 
            })
            return prev;
        }, []) ?? [];
        return {...nutrient, foods: nutrientFoods};
    })
})

const selectMicros = createSelector(selectMicrosFoods, (micros) => {
    return micros?.map((micro) => {
        const unit = micro.DRI.unit;
        return {...micro, value: {amount: micro.foods.reduce((prev, f) => {
            return prev + f.amount;
        }, 0) ,unit}}
    })
})

export default {
    selectMicrosFoods,
    selectDaysName,
    selectMeals,
    selectMacros,
    selectMicros
}
