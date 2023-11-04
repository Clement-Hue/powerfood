import React from 'react';
import classes from "./Meal.module.scss"

const Meal: React.FC<Props> = ({foods, name}) => {
    return (
        <div className={classes.container}>
            {name}
            <div className={classes["food-container"]}>
                {foods?.map((food) => (
                    <div> {food} </div>
                ))}
            </div>
        </div>
    );
};

type Props = {
    name: string
    foods?: React.ReactNode[]
}

export default Meal;