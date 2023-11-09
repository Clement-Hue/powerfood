import React, {useEffect, useId, useMemo, useState} from 'react';
import classes from "./Meal.module.scss"
import {Button, IconButton, Icons, Input} from "@shares";
import convert from "convert-units"
import {Food, TotalNutrients, Unit} from "@typing/app.type.ts";
import {useFoods, useServices} from "@hooks";

const Meal: React.FC<Props> = ({name, onDelete,
                                 onTotalNutrientsChange, id : mealId}) => {
    const [quantity, setQuantity] = useState(100);
    const [mealFoods, setMealFoods] = useState<MealFood[]>([])
    const {foods, selectedFood} = useFoods();
    const {apiService} = useServices();
    const mealNameId = useId();
    const mealFoodsDetails = useMemo(() => (
       foods?.reduce<(Food & MealFood)[]>((prev, food) => {
        const mealFood = mealFoods.find((mf) => mf.id === food.id)
        if (mealFood) {
           return [...prev, {...food, ...mealFood}]
        }
        return prev
    }, []) ?? [] 
    ), [foods, mealFoods])

    const handleAddFood = async (amount: number, unit: Unit) => {
        if (!selectedFood) {
            return;
        }
        await apiService.addFoodToMeal(mealId, selectedFood.id, {amount, unit})
        setMealFoods((prev) => {
            const index = prev.findIndex((food) => food.id === selectedFood?.id)
            if (index !== -1) {
                return  [...prev.slice(0, index), {id: selectedFood.id, amount, unit}, ...prev.slice(index + 1)];
            }
            return [...prev, {id: selectedFood.id, amount, unit}]
        })
    }

    const handleDeleteFood = async (foodId: string) => {
        await apiService.deleteFoodFromMeal(mealId, foodId);
        setMealFoods((prev) => {
            return prev.filter((food) => food.id !== foodId)
        })
    }


    useEffect(() => {
        const getTotalNutrients = mealFoodsDetails.reduce<TotalNutrients>((prev, food) => {
            const amount = food.amount
            food.nutrients.forEach((nutrient) => {
                if (!prev[nutrient.id]) {
                    prev[nutrient.id] = {amount: 0, unit: "mg"}
                }
                prev[nutrient.id].amount += ( convert(nutrient.value).from(nutrient.unit).to("mg") / 100) * amount // divide by 100 to get value for 1g
            })
            return prev;
        }, {})
        onTotalNutrientsChange?.(getTotalNutrients)
    }, [mealFoodsDetails]);

    return (
        <div role="region" aria-labelledby={mealNameId}  className={classes.container}>
            <span id={mealNameId} className={classes["meal__name"]}>
                {name}
                <IconButton aria-label={`Supprimer ${name}`} Icon={Icons.Delete} onClick={() => onDelete?.(name)}/>
            </span>
            <div className={classes["mealFoods-container"]}>
                {mealFoodsDetails?.map((food, i ) => (
                    <div key={`${food}-${i}`} className={classes["food-container"]}>
                        <div >{food.name} {food.amount}{food.unit}</div>
                        <IconButton onClick={() => handleDeleteFood(food.id)} aria-label={`Supprimer ${food.name}`} Icon={Icons.Delete}/>
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
                        mealFoods.some((food) => food.id === selectedFood?.id) ?
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
    onDelete?: (mealName: string) => void
    onTotalNutrientsChange?: (total: TotalNutrients) => void
}

type MealFood = {
    id: string
    amount: number
    unit: Unit
}

export default Meal;