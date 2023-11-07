import React, {useEffect, useId, useState} from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";
import {Food, MealFood, TotalNutrients, Unit} from "@typing/app.type.ts";

const Meal: React.FC<Props> = ({name, onDelete,
                                selectedFood, onTotalNutrientsChange }) => {
    const [quantity, setQuantity] = useState(100);
    const [foods, setFoods] = useState<MealFood[]>([])
    const mealNameId = useId();

    const handleAddFood = (amount: number, unit: Unit) => {
        if (!selectedFood) {
            return;
        }
        setFoods((prev) => {
           return [...prev, {...selectedFood, amount, unit}]
        })
    }

    const handleDeleteFood = (foodId: number) => {
        setFoods((prev) => {
            return prev.filter((food) => food.id !== foodId)
        })
    }


    useEffect(() => {
        const getTotalNutrients = foods.reduce<TotalNutrients>((prev, food) => {
            const amount = food.amount
            food.nutrients.forEach((nutrient) => {
                if (!prev[nutrient.id]) {
                    prev[nutrient.id] = {amount: 0, unit: "mg"}
                }
                prev[nutrient.id].amount += (nutrient.value / 100) * amount // divide by 100 to get value for 1g
            })
            return prev;
        }, {})
        onTotalNutrientsChange?.(getTotalNutrients)
    }, [foods]);

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
                        <IconButton onClick={() => handleDeleteFood(food.id)} aria-label={`Supprimer ${food.name}`} Icon={Icons.Delete}/>
                    </div>
                ))}
            </div>
            <form className={classes["add-food-container"]}
                  onSubmit={(e) => {
                      e.preventDefault();
                      handleAddFood(quantity, "g")
                  }}
            >
                <Input disabled={!selectedFood} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} type="number"
                       placeholder="quantité (g)"/>
                <Button type="submit"
                        disabled={!quantity || !selectedFood || foods.some((food) => food.id === selectedFood?.id)}>
                    Ajouter l'aliment
                </Button>
            </form>
        </div>
    );
};

type Props = {
    name: string
    onDelete?: (mealName: string) => void
    selectedFood?: Food
    onTotalNutrientsChange?: (total: TotalNutrients) => void
}

export default Meal;