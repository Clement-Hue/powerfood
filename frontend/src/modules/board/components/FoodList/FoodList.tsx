import React, {useState} from 'react';
import classes from "./FoodList.module.scss"
import NutrientsInfo from "../NutrientsInfo/NutrientsInfo.tsx";
import {Food} from "@typing/app.type.ts";
import {useFetch, useServices} from "@hooks";
import {IconButton, Icons} from "@shares";

const FoodList: React.FC<Props> = ({selected, onSelect} ) => {
    const [showNutrients, setShowNutrients] = useState<{food: Food, pos: {x:number, y:number}}>();
    const {apiService} = useServices();
    const foods = useFetch(() => apiService.getFoods())
    return !foods?.length ? null : (
        <ul aria-label="Liste des aliments" className={classes.container}>
            {foods?.map((food ) => (
                <li aria-labelledby={`food-${food.id}`} key={food.id} className={classes["item-container"]}>
                    <div onClick={() => onSelect?.(food)} aria-selected={selected?.id === food.id}
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
                        <IconButton aria-label="Editer" Icon={Icons.Edit}/>
                        <IconButton aria-label="Supprimer" Icon={Icons.Delete}/>
                    </div>
                </li>
            ))}
            {showNutrients &&  <NutrientsInfo position={showNutrients.pos} food={showNutrients.food} />}
        </ul>
    );
};

type Props = {
    selected?: Food | null
    onSelect?: (food: Food) => void
}

export default FoodList;