import React from 'react';
import {Input} from "@shares"
import classes from "./Layout.module.scss"
import Day from "../Day";
import Meal from "../Meal";

const Layout = () => {
    const meals = [
        {day: "Jour par défaut", meals: [
            <Meal key="déjeuner" name="déjeuner" foods={["poulet 100g", "riz 200g"]} />,
            <Meal key="diner" name="diner" foods={["jambon 100g", "pate 200g"]} />,
            ]},
    ]
    return (
        <div className={classes.container}>
            <div>
                <Input label="Rechercher un aliment"/>
            </div>
            <div className={classes["days-container"]}>
                {meals.map(({day, meals}) => (
                    <Day key={day} name={day}>
                        {meals}
                    </Day>
                ))}
            </div>
        </div>
    );
};

export default Layout;