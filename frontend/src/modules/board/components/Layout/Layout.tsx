import {useState} from 'react';
import classes from "./Layout.module.scss"
import Day from "../Day";
import Meal from "../Meal";
import type {Food, MealFood, Unit} from "@typing/app.type.ts";
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

    return (
        <div className={classes.container}>
            <FoodSearch selectedFood={selectedFood} onSelect={setSelectedFood}/>
            <div className={classes["days-container"]}>
                {Object.entries(days).map(([dayName, meals]) => (
                    <Day onAddMeal={(mealName) => handleAddMeal(dayName, mealName)}
                         key={dayName} name={dayName}>
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