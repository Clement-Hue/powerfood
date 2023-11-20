import React, {useEffect, useId, useState} from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";
import {Food, MealFoodDetails} from "@typing/app.type.ts";
import {useAppDispatch, useAppSelector, useThunks} from "@hooks";
import {getFoodUnit} from "@utils";
import {foodSelectors} from "@store/food";

const Meal: React.FC<Props> = ({id: mealId, name: mealName, dayName, onDelete,
                                 mealFoods = []  }) => {
    const selectedFood = useAppSelector(foodSelectors.selectSelectedFood)
    const [quantity, setQuantity] = useState(100);
    const {day: {foodAddedToMeal, foodUpdatedFromMeal, foodRemovedFromMeal}} = useThunks();
    const dispatch = useAppDispatch()
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
            dispatch(foodUpdatedFromMeal({dayName, foodId: mealFood.food.id, mealId, amount}))
        } else {
            dispatch(foodAddedToMeal({dayName, foodId: selectedFood.id, mealId, amount}))
        }
    }

    const handleRemoveFood = (food: Food) => {
        dispatch(foodRemovedFromMeal({dayName, foodId: food.id, mealId}));
    }

    return (
        <div role="region" aria-labelledby={mealNameId}  className={classes.container}>
            <span id={mealNameId} className={classes["meal__name"]}>
                {mealName}
                <IconButton aria-label={`Supprimer ${mealName}`} Icon={Icons.Delete} onClick={() => onDelete?.(mealName)}/>
            </span>
            <div className={classes["foods-container"]}>
                {mealFoods?.map((mealFood  ) => (
                    <div key={mealFood.food.id} className={classes["food-container"]}>
                        <div >{mealFood.food.name} {mealFood.amount}{getFoodUnit(mealFood.food.valuesFor)}</div>
                        <IconButton onClick={() => handleRemoveFood(mealFood.food)} aria-label={`Supprimer ${mealFood.food.name}`} Icon={Icons.Delete}/>
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
    id: string
    name: string
    dayName: string
    mealFoods?: MealFoodDetails[]
    onDelete?: (mealName: string) => void
}

export default Meal;