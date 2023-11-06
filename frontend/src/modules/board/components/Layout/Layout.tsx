import {useState} from 'react';
import classes from "./Layout.module.scss"
import Day from "../Day";
import Meal from "../Meal";
import type {Food, MealFood, Unit, Value} from "@typing/app.type.ts";
import FoodSearch from "../FoodSearch";

const Layout = () => {
    const [selectedFood, setSelectedFood] = useState<Food>();
    const [days, setDays] = useState<DayType>({
        ["Jour par défaut"]: {}
    })

    const handleAddMeal = (dayName: string, mealName: string) => {
        setDays((o) => ({
            ...o, [dayName]: {...o[dayName], [mealName]: [] }
        }))
    }

    const handleDeleteMeal = (dayName: string, mealName: string) => {
        setDays((o) => (
            {...o, [dayName]: Object.fromEntries(Object.entries(o[dayName]).filter(([name, _]) => name !== mealName))}
        ))
    }

    const handleAddFood = (dayName: string, mealName: string, amount: number, unit: Unit) => {
        if (!selectedFood) {
            return
        }
        setDays((o) => {
            const meals = o[dayName];
            const foods = meals[mealName]
            if (foods.some((f) => f.id === selectedFood.id)) {
                return o;
            }
            return {...o, [dayName]: {...meals, [mealName]: [...foods, {...selectedFood, amount, unit }]}}
        })
    }

    const handleDeleteFood = (dayName: string, mealName: string, foodId: number) => {
        setDays((o) => {
            const meals = o[dayName];
            const foods = meals[mealName]
            return {...o, [dayName]: {...meals, [mealName]: foods.filter(((f) => f.id !== foodId )) }}
        })
    }

    const getTotalNutrients = (meals: MealType) => {
        return Object.values(meals).reduce<{
            [nutrientId: number]: Value
        }>((prev, foods) => {
           foods.forEach((food) => {
               const amount = food.amount
               food.nutrients.forEach((nutrient) => {
                   if (!prev[nutrient.id]) {
                       prev[nutrient.id] = {amount: 0, unit: "mg"}
                   }
                   prev[nutrient.id].amount = prev[nutrient.id].amount + (nutrient.value / 100) * amount // divide by 100 to get value for 1g
               })
           })
            return prev;
        }, {})
    }

    return (
        <div className={classes.container}>
            <FoodSearch selectedFood={selectedFood} onSelect={setSelectedFood}/>
            <div className={classes["days-container"]}>
                {Object.entries(days).map(([dayName, meals]) => (
                    <Day onAddMeal={(mealName) => handleAddMeal(dayName, mealName)}
                         key={dayName} name={dayName}
                         totalNutrient={getTotalNutrients(meals)}
                    >
                        {Object.entries(meals).map(([mealName, foods]) => (
                            <Meal
                                onDelete={() => handleDeleteMeal(dayName, mealName)}
                                onDeleteFood={(foodId) => handleDeleteFood(dayName, mealName, foodId)}
                                onAddFood={(quantity, unit) => handleAddFood(dayName, mealName, quantity, unit)}
                                disabledAddFood={!selectedFood}
                                key={mealName} name={mealName} foods={foods}/>
                        ))}
                    </Day>
                ))}
            </div>
        </div>
    );
};

type DayType = {
    [key: string]: MealType
}

type MealType = {
    [key: string]: MealFood[]
}

export default Layout;