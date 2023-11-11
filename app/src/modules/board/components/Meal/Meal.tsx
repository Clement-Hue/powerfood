import React, {useId, useState} from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";
import {Food, MealFood, Unit} from "@typing/app.type.ts";
import {useFoods} from "@hooks";

const Meal: React.FC<Props> = ({name, onDelete, onUpdateFood, onAddFood, onRemoveFood,
                                 mealFoods = []  }) => {
    const [quantity, setQuantity] = useState(100);
    const {selectedFood} = useFoods();
    const mealNameId = useId();

    const handleAddFood = async (amount: number, unit: Unit) => {
        if (!selectedFood) {
            return;
        }
        const mealFood = mealFoods?.find((mf) => mf.food.id === selectedFood.id);
        if (mealFood) {
            onUpdateFood?.(mealFood.food, {amount, unit})
        } else {
            onAddFood?.(selectedFood, {amount, unit})
        }
    }

    return (
        <div role="region" aria-labelledby={mealNameId}  className={classes.container}>
            <span id={mealNameId} className={classes["meal__name"]}>
                {name}
                <IconButton aria-label={`Supprimer ${name}`} Icon={Icons.Delete} onClick={() => onDelete?.(name)}/>
            </span>
            <div className={classes["foods-container"]}>
                {mealFoods?.map((mealFood  ) => (
                    <div key={mealFood.food.id} className={classes["food-container"]}>
                        <div >{mealFood.food.name} {mealFood.amount}{mealFood.unit}</div>
                        <IconButton onClick={() => onRemoveFood?.(mealFood.food)} aria-label={`Supprimer ${mealFood.food.name}`} Icon={Icons.Delete}/>
                    </div>
                ))}
            </div>
            <form className={classes["add-food-container"]}
                  onSubmit={async (e) => {
                      e.preventDefault();
                      await handleAddFood(quantity, "g")
                  }}
            >
                <Input disabled={!selectedFood} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} type="number"
                       placeholder="quantité (g)"/>
                <Button type="submit"
                        disabled={!quantity || !selectedFood}>
                    {
                        mealFoods?.some((mf) => mf.food.id === selectedFood?.id) ?
                            "Mettre à jour":  "Ajouter l'aliment"
                    }
                </Button>
            </form>
        </div>
    );
};

type Props = {
    name: string
    onDelete?: (mealName: string) => void
    onAddFood?: (food: Food,  data: {amount: number, unit: Unit}) => void
    onUpdateFood?: (food: Food ,data: {amount: number, unit: Unit}) => void
    onRemoveFood?: (food: Food) => void
    mealFoods?: MealFood[]
}

export default Meal;