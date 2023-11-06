import {useState} from 'react';
import {Input} from "@shares"
import classes from "./Layout.module.scss"
import Day from "../Day";
import Meal from "../Meal";
import FoodList from "../FoodList";
import type {Food} from "@typing/app.type.ts";

const Layout = () => {
    const [selectedFood, setSelectedFood] = useState<Food>();
    const [searchValue, setSearchValue] = useState("");
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

    const handleAddFood = (dayName: string, mealName: string) => {
        if (!selectedFood) {
            return
        }
        setDays((o) => {
            const meals = o[dayName];
            const foods = meals[mealName]
            return {...o, [dayName]: {...meals, [mealName]: [...foods, selectedFood.name]}}
        })
    }

    const handleDeleteFood = (dayName: string, mealName: string, foodName: string) => {
        setDays((o) => {
            const meals = o[dayName];
            const foods = meals[mealName]
            return {...o, [dayName]: {...meals, [mealName]: foods.filter(((f) => f !== foodName )) }}
        })
    }

    return (
        <div className={classes.container}>
            <div className={classes["search-container"]}>
                <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
                <FoodList selected={selectedFood} onSelect={setSelectedFood} />
            </div>
            <div className={classes["days-container"]}>
                {Object.entries(days).map(([dayName, meals]) => (
                    <Day onAddMeal={(mealName) => handleAddMeal(dayName, mealName)}
                         key={dayName} name={dayName}>
                        {Object.entries(meals).map(([mealName, foods]) => (
                            <Meal
                                onDelete={() => handleDeleteMeal(dayName, mealName)}
                                onDeleteFood={(f) => handleDeleteFood(dayName, mealName, f)}
                                onAddFood={() => handleAddFood(dayName, mealName)}
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
    [key: string]: string[]
}

export default Layout;