import React, {useState} from 'react';
import classes from "./Day.module.scss"
import {Summary} from "./components";
import DRI from "src/DRI.json"
import {Button, Input} from "@shares";

const Day: React.FC<Props> = ({name, children, onAddMeal}) => {
    const [mealName, setMealName] = useState("");
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
                <Input value={mealName} onChange={(e) => setMealName(e.target.value)}/>
                <Button type="submit">Ajouter un repas</Button>
            </form>
            <div className={classes["meals-container"]}>
                {children}
            </div>
            <Summary nutrients={DRI}/>
        </div>
    );
};

type Props = {
    name: string
    children?: React.ReactNode
    onAddMeal?: (mealName: string) => void
}

export default Day;