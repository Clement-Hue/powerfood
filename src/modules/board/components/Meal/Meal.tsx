import React from 'react';
import classes from "./Meal.module.scss"
import {Button} from "@shares";

const Meal: React.FC<Props> = ({foods, name}) => {
    return (
        <div className={classes.container}>
            <span className={classes["meal__name"]}>
            {name}
            </span>
            <div className={classes["food-container"]}>
                {foods?.map((food) => (
                    <div> {food} </div>
                ))}
            </div>
            <Button>Ajouter l'aliment</Button>
        </div>
    );
};

type Props = {
    name: string
    foods?: React.ReactNode[]
}

export default Meal;