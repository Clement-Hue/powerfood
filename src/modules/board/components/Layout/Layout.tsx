import React from 'react';
import {Input} from "@shares"
import classes from "./Layout.module.scss"
import Day from "../Day";
import Meal from "../Meal";

const Layout = () => {
    const meals = [
        {day: "lundi", meals: [
            <Meal name="déjeuner" foods={["poulet 100g", "riz 200g"]} />,
            <Meal name="diner" foods={["jambon 100g", "pate 200g"]} />,
            ]},
        {day: "mardi", meals: []},
        {day: "mercredi", meals: []},
        {day: "jeudi", meals: []},
        {day: "vendredi", meals: []},
        {day: "samedi", meals: []},
        {day: "dimanche", meals: []},
    ]
    return (
        <div className={classes.container}>
            <div>
                <Input label="Rechercher un aliment"/>
            </div>
            <div className={classes["days-container"]}>
                {meals.map(({day, meals}) => (
                    <Day name={day}>
                        {meals}
                    </Day>
                ))}
            </div>
        </div>
    );
};

export default Layout;