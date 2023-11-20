import React, {useState} from 'react';
import Summary from "../Summary"
import {Button, Input} from "@shares";
import {useAppDispatch, useAppSelector, useThunks} from "@hooks";
import Meal from "../Meal";
import {daySelectors} from "@store/day";
import classes from "./Day.module.scss"

const Day: React.FC<Props> = ({name: dayName}) => {
    const [newMealInput, setNewMealInput] = useState("");
    const meals = useAppSelector((state) => daySelectors.selectMeals(state, dayName))
    const macros = useAppSelector((state) => daySelectors.selectMacros(state, dayName))
    const micros = useAppSelector((state) => daySelectors.selectMicros(state, dayName))
    const {day: {mealAdded, mealDeleted}} = useThunks();
    const dispatch = useAppDispatch()

    return (
        <div className={classes.container}>
            <div className={classes["day__name"]}>
                {dayName}
            </div>
            <form
                className={classes["day__add-meal"]}
                onSubmit={async (e) => {
                    e.preventDefault();
                    dispatch(mealAdded({dayName, mealName: newMealInput}))
                    setNewMealInput("") // reset input
            }}>
                <Input placeholder="Repas" aria-label="Repas"  value={newMealInput} onChange={(e) => setNewMealInput(e.target.value)}/>
                <Button disabled={!newMealInput || meals?.some((m) => m.name === newMealInput)} type="submit">Ajouter un repas</Button>
            </form>
            <div className={classes["meals-container"]}>
                {meals.map(( {id: mealId, name: mealName, foods}) => (
                    <Meal
                        id={mealId}
                        name={mealName}
                        dayName={dayName}
                        mealFoods={foods}
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