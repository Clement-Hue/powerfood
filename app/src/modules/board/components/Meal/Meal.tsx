import React, {useEffect, useId, useState} from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";
import {Food, MealFoodDetails, FoodUnit} from "@typing/app.type.ts";
import {useFoods} from "@hooks";

const Meal: React.FC<Props> = ({name, onDelete, onUpdateFood, onAddFood, onRemoveFood,
                                 mealFoods = []  }) => {
    const {foods, selectedFoodId} = useFoods();
    const [quantity, setQuantity] = useState(100);
    const mealNameId = useId();

    useEffect(() => {
       if (selectedFoodId !== null && foods) {
           const value = {
               "100g": 100,
               "unit": 1,
           }
           setQuantity(value[foods[selectedFoodId].valuesFor])
       }
    }, [selectedFoodId, foods]);

    const handleAddFood = async (amount: number) => {
        if (!selectedFoodId) {
            return;
        }
        const mealFood = mealFoods?.find((mf) => mf.food.id === selectedFoodId);
        if (mealFood) {
            const unit = mealFood.food.valuesFor === "unit" ? "unit" : "g";
            onUpdateFood?.(mealFood.food, {amount, unit})
        } else {
            const food = foods?.[selectedFoodId]
            if (food) {
                const unit = food.valuesFor === "unit" ? "unit": "g";
                onAddFood?.(food, {amount, unit})
            }
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
                      await handleAddFood(quantity)
                  }}
            >
                <Input disabled={!selectedFoodId} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} type="number"
                       placeholder="quantité" right={selectedFoodId && foods?.[selectedFoodId].valuesFor === "unit" ? "Unité": "g"}/>
                <Button type="submit"
                        disabled={!quantity || !selectedFoodId}>
                    {
                        mealFoods?.some((mf) => mf.food.id === selectedFoodId) ?
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
    onAddFood?: (food: Food, data: {amount: number, unit: FoodUnit}) => void
    onUpdateFood?: (food: Food , data: {amount: number, unit: FoodUnit}) => void
    onRemoveFood?: (food: Food) => void
}

export default Meal;