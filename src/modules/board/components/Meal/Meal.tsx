import React from 'react';
import classes from "./Meal.module.scss"
import {Button} from "@shares";

const Meal: React.FC<Props> = ({foods, name, onDelete}) => {
    return (
        <div className={classes.container}>
            <span className={classes["meal__name"]}>
                {name}
                <Button onClick={() => onDelete?.(name)}>Supprimer</Button>
            </span>
            <div className={classes["food-container"]}>
                {foods?.map((food, i) => (
                    <div key={i}> {food} </div>
                ))}
            </div>
            <Button>Ajouter l'aliment</Button>
        </div>
    );
};

type Props = {
    name: string
    foods?: string[]
    onDelete?: (name: string) => void
}

export default Meal;