import React from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";

const Meal: React.FC<Props> = ({foods, name, onDelete,
                               onAddFood, disabledAddFood,
                               onDeleteFood}) => {
    return (
        <div className={classes.container}>
            <span className={classes["meal__name"]}>
                {name}
                <IconButton aria-label="Supprimer" Icon={Icons.Delete} onClick={() => onDelete?.(name)}/>
            </span>
            <div className={classes["foods-container"]}>
                {foods?.map((food, i ) => (
                    <div key={`${food}-${i}`} className={classes["food-container"]}>
                        <div > {food} </div>
                        <IconButton onClick={() => onDeleteFood?.(food)} aria-label="Supprimer" Icon={Icons.Delete}/>
                    </div>
                ))}
            </div>
            <form className={classes["add-food-container"]}
                  onSubmit={(e) => {
                      e.preventDefault();
                      onAddFood?.(name)
                  }}
            >
                <Input disabled={disabledAddFood} required defaultValue={100} min={0} type="number" placeholder="quantité (g)"/>
                <Button type="submit" disabled={disabledAddFood}>Ajouter l'aliment</Button>
            </form>
        </div>
    );
};

type Props = {
    name: string
    foods?: string[]
    onDelete?: (mealName: string) => void
    onDeleteFood?: (foodName: string) => void
    onAddFood?: (mealName: string) => void
    disabledAddFood?: boolean
}

export default Meal;