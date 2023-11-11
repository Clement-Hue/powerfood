import React, {useEffect, useState} from 'react';
import Summary from "../Summary"
import {Button, Input} from "@shares";
import {useServices, useFetch} from "@hooks";
import {TotalNutrients, Value} from "@typing/app.type.ts";
import convert from "convert-units"
import Meal from "../Meal";
import classes from "./Day.module.scss"

const Day: React.FC<Props> = ({name: dayName}) => {
    const [newMealInput, setNewMealInput] = useState("");
    const [meals, setMeals] = useState<MealsState>({});
    const {apiService} = useServices();
    const [dri] = useFetch(() => apiService.getNutrients())
    const nutrients = dri?.map((nutrient) => {
        const value = Object.values(meals).filter((mealData) => !!mealData.totalNutrients[nutrient.id]).reduce<Value | null>((prev, mealData) => {
            const nutrientValue = mealData.totalNutrients[nutrient.id];
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
        const id = await apiService.addMeal(dayName, newMealInput);
        setMeals((prev) => {
            return {...prev, [id]: {name: newMealInput, totalNutrients: []}}
        })
        setNewMealInput("") // reset input
    }

    const handleDeleteMeal = async (mealId: string) => {
        await apiService.deleteMeal(mealId)
        setMeals((prev) => {
            return Object.fromEntries(Object.entries(prev).filter(([key, _]) => (
                key !== mealId
            )))
        })
    }

    useEffect(() => {
        (async function () {
            const res = await apiService.getMeals(dayName);
            if (!res?.length) {
                return
            }
            setMeals((prev) => ({
                ...prev, ...res.reduce<MealsState>((reduced, m) => {
                    return {...reduced, [m.id]: {name: m.name, totalNutrients: []}}
                }, {})
            }))
        })()
    }, [apiService, dayName]);

    return (
        <div className={classes.container}>
            <div className={classes["day__name"]}>
                {dayName}
            </div>
            <form
                className={classes["day__add-meal"]}
                onSubmit={async (e) => {
                e.preventDefault();
                await handleAddMeal()
            }}>
                <Input placeholder="Repas" aria-label="Repas"  value={newMealInput} onChange={(e) => setNewMealInput(e.target.value)}/>
                <Button disabled={!newMealInput || Object.values(meals).some((m) => m.name === newMealInput)} type="submit">Ajouter un repas</Button>
            </form>
            <div className={classes["meals-container"]}>
                {Object.entries(meals).map(( [mealId, {name: mealName}]) => (
                    <Meal
                        id={mealId}
                        name={mealName}
                        onDelete={() => handleDeleteMeal(mealId)}
                        onTotalNutrientsChange={(totalNutrients) => setMeals((prev) => (
                            {...prev, [mealId]: {name: mealName, totalNutrients}}
                        ))}
                        key={mealId} />
                ))}
            </div>
            <Summary nutrients={nutrients}/>
        </div>
    );
};


type Props = {
    name: string
}

type MealsState = {[mealId: string]: {name: string, totalNutrients: TotalNutrients}}

export default Day;