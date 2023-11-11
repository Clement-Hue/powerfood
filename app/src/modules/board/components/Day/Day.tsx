import React, {useMemo, useState} from 'react';
import Summary from "../Summary"
import {Button, Input} from "@shares";
import {useServices, useFetch, useFoods} from "@hooks";
import type {Unit, Food, MealFood, Meal as MealType} from "@typing/app.type.ts";
import Meal from "../Meal";
import classes from "./Day.module.scss"
import convert from "convert-units";

const Day: React.FC<Props> = ({name: dayName}) => {
    const [newMealInput, setNewMealInput] = useState("");
    const {apiService} = useServices();
    const {foods = []} = useFoods();
    const [dri] = useFetch(() => apiService.getNutrients())
    const [meals = [], setMeals] = useFetch(() => apiService.getMeals(dayName))
    const mealsComputed : MealType[] = useMemo( () => meals.map((meal) => {
        return {...meal, foods: foods.reduce<MealFood[]>((prev, food) => {
                const mealFood = meal.foods.find((f) => f.id === food.id)
                return !mealFood ? prev : [...prev, {food, amount: mealFood.amount, unit: mealFood.unit}]
            }, [])}
        }), [foods, meals])

    const nutrients = dri?.map((nutrient) => {
        const unit = nutrient.DRI.unit
        const amount = mealsComputed?.reduce((prev, meal) => {
            meal.foods?.forEach((mf) => {
                const foodNutrient = mf.food.nutrients.find((n) => n.id === nutrient.id)
                if (foodNutrient) {
                    prev += mf.amount * (convert(foodNutrient.amount).from(foodNutrient.unit).to(unit) / 100)
                }
            })
            return prev;
        }, 0) ?? 0;
        return {...nutrient, value: {amount, unit}}
    })

    const handleAddMeal = async () => {
        const id = await apiService.addMeal(dayName, newMealInput);
        setMeals((prev = []) => {
            return [...prev, {id, name: newMealInput, foods: []}]
        })
        setNewMealInput("") // reset input
    }

    const handleDeleteMeal = async (mealId: string) => {
        await apiService.deleteMeal(mealId)
        setMeals((prev = []) => {
            return prev.filter((m) => m.id !== mealId)
        })
    }

    const handleRemoveFood = async (mealId: string ,food: Food) => {
        await apiService.deleteFoodFromMeal(mealId, food.id);
        setMeals((prev ) => prev?.map((m) => (
                 m.id !== mealId ? m :  {...m, foods: m.foods.filter((mf) => mf.id !== food.id)}
            )))
    }

    const handleAddFood = async (mealId: string, food: Food, {amount, unit}: {amount: number, unit: Unit}) => {
        await apiService.addFoodToMeal(mealId, food.id, {amount, unit})
        setMeals((prev) => prev?.map((m) => (
            m.id !== mealId ? m : {...m, foods: [...m.foods, {id: food.id, amount, unit}]}
        )))
    }

    const handleUpdateFood = async (mealId: string, food: Food, {amount, unit}: {amount: number, unit: Unit}) => {
        await apiService.updateFoodMeal(mealId, food.id, {amount, unit})
        setMeals((prev) => prev?.map((m) => (
            m.id !== mealId ? m : {...m, foods: m.foods.map((mf) => (
                    mf.id !== food.id ? mf : {...mf, unit, amount}
                ))}
        )))
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
                {mealsComputed?.map(( {id: mealId, name: mealName, foods}) => (
                    <Meal
                        name={mealName}
                        mealFoods={foods}
                        onUpdateFood={(food, data) => handleUpdateFood(mealId, food, data)}
                        onAddFood={(food, data) => handleAddFood(mealId, food, data)}
                        onRemoveFood={(food) => handleRemoveFood(mealId, food)}
                        onDelete={() => handleDeleteMeal(mealId)}
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


export default Day;