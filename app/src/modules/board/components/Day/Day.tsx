import React, {useEffect, useMemo, useState} from 'react';
import Summary from "../Summary"
import {Button, Input} from "@shares";
import {useAppDispatch, useAppSelector, useFetch, useServices, useThunks} from "@hooks";
import Meal from "../Meal";
import convert from "convert-units";
import classes from "./Day.module.scss"
import {daySelectors} from "@store/day";

const Day: React.FC<Props> = ({name: dayName}) => {
    const [newMealInput, setNewMealInput] = useState("");
    const {apiService} = useServices();
    const [dri] = useFetch(() => apiService.getNutrients())
    const meals = useAppSelector((state) => daySelectors.selectMeals(state, dayName))
    const {day: {mealAdded, mealDeleted, foodAddedToMeal, foodUpdatedFromMeal,
        foodRemovedFromMeal, mealsFetched}} = useThunks();
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(mealsFetched({dayName}))
    }, []);

    const macros = useMemo( () => (["calories","proteins", "carbs", "lipids"] as const).map((macroName) => {
        const res = {name: macroName, amount: 0}
        meals.forEach((meal) => {
           meal.foods.forEach((mf) => {
               const denominator = mf.food.valuesFor === "100g" ? 100 : 1
               res.amount += (mf.food[macroName] / denominator) * mf.amount
           })
        })
        return res;
    }), [meals])

    const micros = useMemo( () => dri?.map((nutrient) => {
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
    }), [dri, meals])

    const handleAddMeal = async () => {
        dispatch(mealAdded({dayName, mealName: newMealInput}))
        setNewMealInput("") // reset input
    }

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
                <Button disabled={!newMealInput || meals?.some((m) => m.name === newMealInput)} type="submit">Ajouter un repas</Button>
            </form>
            <div className={classes["meals-container"]}>
                {meals.map(( {id: mealId, name: mealName, foods}) => (
                    <Meal
                        name={mealName}
                        mealFoods={foods}
                        onUpdateFood={(food, {amount}) => dispatch(foodUpdatedFromMeal({dayName, foodId: food.id, mealId, amount}))}
                        onAddFood={(food, {amount}) => dispatch(foodAddedToMeal({dayName, foodId: food.id, mealId, amount}))}
                        onRemoveFood={(food) => dispatch(foodRemovedFromMeal({dayName, foodId: food.id, mealId}))}
                        onDelete={() => dispatch(mealDeleted({dayName, mealId}))}
                        key={mealId} />
                ))}
            </div>
            <Summary macros={macros} micros={micros}/>
        </div>
    );
};


type Props = {
    name: string
}


export default Day;