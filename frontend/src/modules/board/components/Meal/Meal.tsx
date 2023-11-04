import React from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";

const Meal: React.FC<Props> = ({foods, name, onDelete,
                               onAddFood, disabledAddFoodButton}) => {
    return (
        <div className={classes.container}>
            <span className={classes["meal__name"]}>
                {name}
                <IconButton Icon={Icons.Delete} onClick={() => onDelete?.(name)}/>
            </span>
            <div className={classes["foods-container"]}>
                {foods?.map((food, i ) => (
                    <div key={`${food}-${i}`} className={classes["food-container"]}>
                        <div > {food} </div>
                        <IconButton Icon={Icons.Delete}/>
                    </div>
                ))}
            </div>
            <div className={classes["add-food-container"]}>
                <Input min={0} type="number" placeholder="quantité (g)"/>
                <Button disabled={disabledAddFoodButton} onClick={() => onAddFood?.(name)}>Ajouter l'aliment</Button>
            </div>
        </div>
    );
};

type Props = {
    name: string
    foods?: string[]
    onDelete?: (name: string) => void
    onAddFood?: (name: string) => void
    disabledAddFoodButton?: boolean
}

export default Meal;