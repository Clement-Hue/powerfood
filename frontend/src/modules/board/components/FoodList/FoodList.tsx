import React, {useState} from 'react';
import classes from "./FoodList.module.scss"
import NutrientsInfo from "../NutrientsInfo/NutrientsInfo.tsx";
import {Food} from "@typing/app.type.ts";
import {useFetch, useServices} from "@hooks";
import {IconButton, Icons} from "@shares";

const FoodList: React.FC<Props> = ({selected, onSelect} ) => {
    const [showNutrients, setShowNutrients] = useState<{id: number, pos: {x:number, y:number}}>();
    const {apiService} = useServices();
    const foods = useFetch(() => apiService.getFoods())
    return !foods?.length ? null : (
        <div className={classes.container}>
            {foods?.map((food) => (
                <div className={classes["item-container"]}>
                    <div onClick={() => onSelect?.(food)} data-selected={selected?.id === food.id} key={food.id}
                         onMouseEnter={(e) => setShowNutrients({
                             id: food.id, pos: {x: e.clientX, y: e.clientY}
                         })}
                         onMouseLeave={() => setShowNutrients(undefined)}
                         className={classes["food-container"]}>
                        <span>{food.name}</span>
                        <span>{food.description}</span>
                        {showNutrients?.id === food.id &&  <NutrientsInfo position={showNutrients.pos} nutrients={food.nutrients} />}
                    </div>
                    <div className={classes["actions-container"]}>
                        <IconButton aria-label="Editer" Icon={Icons.Edit}/>
                        <IconButton aria-label="Supprimer" Icon={Icons.Delete}/>
                    </div>
                </div>
            ))}
        </div>
    );
};

type Props = {
    selected?: Food
    onSelect?: (food: Food) => void
}

export default FoodList;