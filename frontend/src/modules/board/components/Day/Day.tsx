import React, {useState} from 'react';
import classes from "./Day.module.scss"
import Summary from "../Summary"
import {Button, Input} from "@shares";
import {useFetch, useServices} from "@hooks";
import {Value} from "@typing/app.type.ts";

const Day: React.FC<Props> = ({name, children, onAddMeal, totalNutrient = []}) => {
    const [mealName, setMealName] = useState("");
    const {apiService} = useServices();
    const dri = useFetch(() => apiService.getNutrients())
    const nutrients = dri?.map((nutrient) => {
       const value = totalNutrient[nutrient.id]
        if (!value) {
            return nutrient
        }
        return {...nutrient, value}
    })
    return (
        <div className={classes.container}>
            <div className={classes["day__name"]}>
                {name}
            </div>
            <form
                className={classes["day__add-meal"]}
                onSubmit={(e) => {
                e.preventDefault();
                onAddMeal?.(mealName);
            }}>
                <Input placeholder="Repas" aria-label="Repas"  value={mealName} onChange={(e) => setMealName(e.target.value)}/>
                <Button type="submit">Ajouter un repas</Button>
            </form>
            <div className={classes["meals-container"]}>
                {children}
            </div>
            <Summary nutrients={nutrients}/>
        </div>
    );
};

type Props = {
    name: string
    children?: React.ReactNode
    onAddMeal?: (mealName: string) => void
    totalNutrient?: {
        [nutrientId: number]: Value
    }
}

export default Day;