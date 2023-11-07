import React, {useId, useState} from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";
import {MealFood, Unit} from "@typing/app.type.ts";

const Meal: React.FC<Props> = ({foods, name, onDelete,
                               onAddFood, disabledAddFood,
                               onDeleteFood}) => {
    const [quantity, setQuantity] = useState(100);
    const mealNameId = useId();
    return (
        <div role="region" aria-labelledby={mealNameId}  className={classes.container}>
            <span id={mealNameId} className={classes["meal__name"]}>
                {name}
                <IconButton aria-label={`Supprimer ${name}`} Icon={Icons.Delete} onClick={() => onDelete?.(name)}/>
            </span>
            <div className={classes["foods-container"]}>
                {foods?.map((food, i ) => (
                    <div key={`${food}-${i}`} className={classes["food-container"]}>
                        <div >{food.name} {food.amount}{food.unit}</div>
                        <IconButton onClick={() => onDeleteFood?.(food.id)} aria-label={`Supprimer ${food.name}`} Icon={Icons.Delete}/>
                    </div>
                ))}
            </div>
            <form className={classes["add-food-container"]}
                  onSubmit={(e) => {
                      e.preventDefault();
                      onAddFood?.(quantity, "g")
                  }}
            >
                <Input disabled={disabledAddFood} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} type="number"
                       placeholder="quantité (g)"/>
                <Button type="submit" disabled={disabledAddFood}>Ajouter l'aliment</Button>
            </form>
        </div>
    );
};

type Props = {
    name: string
    foods?: MealFood[]
    onDelete?: (mealName: string) => void
    onDeleteFood?: (foodId: number) => void
    onAddFood?: (amount: number, unit: Unit) => void
    disabledAddFood?: boolean
}

export default Meal;