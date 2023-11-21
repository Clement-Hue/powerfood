import React, {useState} from 'react';
import classes from "./FoodList.module.scss"
import NutrientsInfo from "../NutrientsInfo/NutrientsInfo.tsx";
import {Food, UnidentifiedFood} from "@typing/app.type.ts";
import {IconButton, Icons} from "@shares";
import FoodDialog from "../FoodDialog";
import {useAppDispatch, useThunks} from "@hooks";

const FoodList: React.FC<Props> = ({selected, onDeleteFood, foods = [], onSelect} ) => {
    const [showNutrients, setShowNutrients] = useState<{foodId: string, pos: {x:number, y:number}} | null>(null);
    const [editFood, setEditFood] = useState<Food | null>(null);
    const {food: {foodUpdated}} = useThunks()
    const dispatch = useAppDispatch()
    const handleValidateFoodDialog = async (data: UnidentifiedFood) => {
        if (!editFood) {
            return
        }
        const foodId = editFood.id
        await dispatch(foodUpdated({foodId, data}))
        setEditFood(null)
    }

    return  (
        <ul aria-label="Liste des aliments" className={classes.container}>
            {foods.map((food ) => (
                <li aria-labelledby={`food-${food.id}`} key={food.id} className={classes["item-container"]}>
                    <div onClick={() => onSelect?.(food.id)} aria-selected={selected?.id === food.id}
                         onMouseEnter={(e) => setShowNutrients({
                             foodId: food.id, pos: {x: e.clientX, y: e.clientY}
                         })}
                         data-testid={`food-${food.name}`}
                         onMouseLeave={() => setShowNutrients(null)}
                         className={classes["food-container"]}>
                        <span id={`food-${food.id}`}>{food.name}</span>
                        {showNutrients?.foodId === food.id &&  <NutrientsInfo position={showNutrients.pos} food={food} />}
                    </div>
                    <div className={classes["actions-container"]}>
                        <IconButton aria-label="Editer" onClick={() => setEditFood(food)} Icon={Icons.Edit}/>
                        <IconButton onClick={() => onDeleteFood?.(food.id)} aria-label="Supprimer" Icon={Icons.Delete}/>
                    </div>
                </li>
            ))}
            <FoodDialog title="Editer l'aliment" open={!!editFood} initValues={editFood} onValidate={handleValidateFoodDialog} onClose={() => setEditFood(null)}/>
        </ul>
    );
};

type Props = {
    selected: Food | null
    onSelect?: (foodId: string) => void
    onDeleteFood?: (foodId: string) => void
    foods?: Food[]
}

export default FoodList;