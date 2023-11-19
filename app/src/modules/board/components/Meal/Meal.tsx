import React, {useEffect, useId, useState} from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";
import {Food, MealFoodDetails} from "@typing/app.type.ts";
import {useAppSelector} from "@hooks";
import {getFoodUnit} from "@utils";
import {foodSelectors} from "@store/food";

const Meal: React.FC<Props> = ({name, onDelete, onUpdateFood, onAddFood, onRemoveFood,
                                 mealFoods = []  }) => {
    const selectedFood = useAppSelector(foodSelectors.selectSelectedFood)
    const [quantity, setQuantity] = useState(100);
    const mealNameId = useId();

    useEffect(() => {
       if (selectedFood) {
           const value = {
               "100g": 100,
               "unit": 1,
           }
           setQuantity(value[selectedFood.valuesFor])
       }
    }, [selectedFood]);

    const handleAddFood = async (amount: number) => {
        if (!selectedFood) {
            return;
        }
        const mealFood = mealFoods?.find((mf) => mf.food.id === selectedFood.id);
        if (mealFood) {
            onUpdateFood?.(mealFood.food, {amount})
        } else {
            onAddFood?.(selectedFood, {amount})
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
                        <div >{mealFood.food.name} {mealFood.amount}{getFoodUnit(mealFood.food.valuesFor)}</div>
                        <IconButton onClick={() => onRemoveFood?.(mealFood.food)} aria-label={`Supprimer ${mealFood.food.name}`} Icon={Icons.Delete}/>
                    </div>
                ))}
            </div>
            <form className={classes["add-food-container"]}
                  onSubmit={async (e) => {
                      e.preventDefault();
                      await handleAddFood(quantity)
                  }}
            >
                <Input disabled={!selectedFood} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} type="number"
                       placeholder="quantité" right={selectedFood?.valuesFor === "unit" ? "Unité": "g"}/>
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
    mealFoods?: MealFoodDetails[]
    onDelete?: (mealName: string) => void
    onAddFood?: (food: Food, data: {amount: number}) => void
    onUpdateFood?: (food: Food , data: {amount: number}) => void
    onRemoveFood?: (food: Food) => void
}

export default Meal;