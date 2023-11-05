import React from 'react';
import {AbridgedFoodNutrient} from "@typing/api.type.ts";
import classes from "./NutrientsInfo.module.scss"

const NutrientsInfo: React.FC<Props> = ({nutrients}) => {
    return !nutrients?.length ? null : (
        <div className={classes.container}>
            {nutrients.map((nutrient) => (
               <div key={nutrient.nutrientId} className={classes["nutrient-container"]}>
                   <span className={classes["nutrient__name"]}>{nutrient.nutrientName}</span>
                   <span>{nutrient.value} {nutrient.unitName}</span>
               </div>
            ))}
        </div>
    );
};

type Props = {
    nutrients?: AbridgedFoodNutrient[]
}

export default NutrientsInfo;