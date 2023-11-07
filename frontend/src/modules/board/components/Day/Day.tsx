import React, {useState} from 'react';
import classes from "./Day.module.scss"
import Summary from "../Summary"
import {Button, Input} from "@shares";
import {useFetch, useServices} from "@hooks";
import {Food, TotalNutrients, Value} from "@typing/app.type.ts";
import Meal from "../Meal";

const Day: React.FC<Props> = ({name, selectedFood}) => {
    const [newMealInput, setNewMealInput] = useState("");
    const [meals, setMeals] = useState<string[]>([])
    const [totalNutrients, setTotalNutrients] = useState<{[mealName: string]: TotalNutrients}>({});
    const {apiService} = useServices();
    const dri = useFetch(() => apiService.getNutrients())
    const nutrients = dri?.map((nutrient) => {
       const value = Object.values(totalNutrients).reduce<Value | null>((prev, n) => {
           if (!n[nutrient.id]) {
               return prev;
           }
           if (!prev) {
               return {...n[nutrient.id]}
           }
           prev.amount += n[nutrient.id].amount
          return prev;
       }, null)
        if (!value) {
            return nutrient
        }
        return {...nutrient, value}
    })

    const handleAddMeal = () => {
        if (meals.includes(newMealInput)) {
            return;
        }
        setMeals((prev) => {
            return [...prev, newMealInput]
        })
    }

    const handleDeleteMeal = (mealName: string) => {
        setMeals((prev) => {
            return prev.filter((meal) => meal !== mealName)
        })
    }


    return (
        <div className={classes.container}>
            <div className={classes["day__name"]}>
                {name}
            </div>
            <form
                className={classes["day__add-meal"]}
                onSubmit={(e) => {
                e.preventDefault();
                handleAddMeal()
            }}>
                <Input placeholder="Repas" aria-label="Repas"  value={newMealInput} onChange={(e) => setNewMealInput(e.target.value)}/>
                <Button type="submit">Ajouter un repas</Button>
            </form>
            <div className={classes["meals-container"]}>
                {meals.map((mealName) => (
                    <Meal
                        onDelete={() => handleDeleteMeal(mealName)}
                        selectedFood={selectedFood}
                        onTotalNutrientsChange={(total) => setTotalNutrients((prev) => (
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
    selectedFood?: Food
}

export default Day;