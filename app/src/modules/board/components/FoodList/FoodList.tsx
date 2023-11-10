import React, {useState} from 'react';
import classes from "./FoodList.module.scss"
import NutrientsInfo from "../NutrientsInfo/NutrientsInfo.tsx";
import {Food, UnidentifiedFood} from "@typing/app.type.ts";
import {IconButton, Icons} from "@shares";
import FoodDialog from "../FoodDialog";
import {useFoods, useServices} from "@hooks";

const FoodList: React.FC<Props> = ({selected, onDeleteFood, foods = [], onSelect} ) => {
    const {apiService} = useServices();
    const [showNutrients, setShowNutrients] = useState<{food: Food, pos: {x:number, y:number}}>();
    const [editFood, setEditFood] = useState<Food | null>(null);
    const {setFoods} = useFoods();

    const handleValidateFoodDialog = async (data: UnidentifiedFood) => {
        if (!editFood) {
            return
        }
        const foodId = editFood.id
        await apiService.updateFood(foodId, data);
        setFoods((prev) => {
            if (!prev) {
                return
            }
            const foodIndex = prev.findIndex((f) => f.id === foodId)
            if (foodIndex === -1) {
                return prev;
            }
            return [...prev.slice(0, foodIndex), {...data, id: foodId}, ...prev.slice(foodIndex + 1)]
        })
        setEditFood(null)
    }

    return !foods?.length ? null : (
        <ul aria-label="Liste des aliments" className={classes.container}>
            {foods?.map((food ) => (
                <li aria-labelledby={`food-${food.id}`} key={food.id} className={classes["item-container"]}>
                    <div onClick={() => onSelect?.(food.id)} aria-selected={selected === food.id}
                         onMouseEnter={(e) => setShowNutrients({
                             food, pos: {x: e.clientX, y: e.clientY}
                         })}
                         data-testid={`food-${food.name}`}
                         onMouseLeave={() => setShowNutrients(undefined)}
                         className={classes["food-container"]}>
                        <span id={`food-${food.id}`}>{food.name}</span>
                        <span>{food.description}</span>
                    </div>
                    <div className={classes["actions-container"]}>
                        <IconButton aria-label="Editer" onClick={() => setEditFood(food)} Icon={Icons.Edit}/>
                        <IconButton onClick={() => onDeleteFood?.(food.id)} aria-label="Supprimer" Icon={Icons.Delete}/>
                    </div>
                </li>
            ))}
            {showNutrients &&  <NutrientsInfo position={showNutrients.pos} food={showNutrients.food} />}
            {!!editFood && <FoodDialog open initValues={editFood} onValidate={handleValidateFoodDialog} onClose={() => setEditFood(null)}/>}
        </ul>
    );
};

type Props = {
    selected: string | null
    onSelect?: (foodId: string) => void
    onDeleteFood?: (foodId: string) => void
    foods?: Food[]
}

export default FoodList;