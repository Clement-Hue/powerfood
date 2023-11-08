import React, {useState} from 'react';
import Summary from "../Summary"
import {Button, Input} from "@shares";
import {useFetch, useServices} from "@hooks";
import {Food, TotalNutrients, Value} from "@typing/app.type.ts";
import convert from "convert-units"
import Meal from "../Meal";
import classes from "./Day.module.scss"

const Day: React.FC<Props> = ({name, selectedFood}) => {
    const [newMealInput, setNewMealInput] = useState("");
    const [meals, setMeals] = useState<{[mealName: string]: TotalNutrients}>({});
    const {apiService} = useServices();
    const [dri] = useFetch(() => apiService.getNutrients())
    const nutrients = dri?.map((nutrient) => {
        const value = Object.values(meals).filter((mealNutrients) => !!mealNutrients[nutrient.id]).reduce<Value | null>((prev, mealNutrients) => {
            const nutrientValue = mealNutrients[nutrient.id];
            const unit = nutrient.DRI.unit
            const nutrientAmount = convert(nutrientValue.amount).from(nutrientValue.unit).to(unit);
            if (!prev) {
                return {amount: nutrientAmount, unit}
            }
            prev.amount += nutrientAmount;
           return prev;
        }, null)
        return value ? {...nutrient, value} : nutrient;
    })

    const handleAddMeal = async () => {
        await apiService.addMeal(name);
        setMeals((prev) => {
            return {...prev, [newMealInput]: {}}
        })
        setNewMealInput("") // reset input
    }

    const handleDeleteMeal = async (mealName: string) => {
        await apiService.deleteMeal(`${name}-${mealName}`);
        setMeals((prev) => {
            return Object.fromEntries(Object.entries(prev).filter(([key, _]) => (
                key !== mealName
            )))
        })
    }


    return (
        <div className={classes.container}>
            <div className={classes["day__name"]}>
                {name}
            </div>
            <form
                className={classes["day__add-meal"]}
                onSubmit={async (e) => {
                e.preventDefault();
                await handleAddMeal()
            }}>
                <Input placeholder="Repas" aria-label="Repas"  value={newMealInput} onChange={(e) => setNewMealInput(e.target.value)}/>
                <Button disabled={!newMealInput || !!meals[newMealInput]} type="submit">Ajouter un repas</Button>
            </form>
            <div className={classes["meals-container"]}>
                {Object.keys(meals).map((mealName) => (
                    <Meal
                        id={`${name}-${mealName}`}
                        onDelete={() => handleDeleteMeal(mealName)}
                        selectedFood={selectedFood}
                        onTotalNutrientsChange={(total) => setMeals((prev) => (
                            {...prev, [mealName]: total}
                        ))}
                        key={mealName} name={mealName}/>
                ))}
            </div>
            <Summary nutrients={nutrients}/>
        </div>
    );
};


type Props = {
    name: string
    selectedFood?: Food | null
}

export default Day;