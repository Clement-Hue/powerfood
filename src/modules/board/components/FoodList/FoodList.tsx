import React from 'react';
import {SearchResultFood} from "@types/api.type.ts";
import classes from "./FoodList.module.scss"

const FoodList: React.FC<Props> = ({foods, selected, onSelect}) => {
    return (
        <div className={classes.container}>
            {foods?.map((food) => (
                <div onClick={() => onSelect?.(food)} data-selected={selected?.fdcId === food.fdcId} key={food.fdcId} className={classes["item-container"]}>
                    <span>{food.description}</span>
                </div>
            ))}
        </div>
    );
};

type Props = {
    foods?: SearchResultFood[]
    selected?: SearchResultFood
    onSelect?: (food: SearchResultFood) => void
}

export default FoodList;