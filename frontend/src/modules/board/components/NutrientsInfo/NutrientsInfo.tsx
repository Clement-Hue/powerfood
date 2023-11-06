import React from 'react';
import classes from "./NutrientsInfo.module.scss"
import {FoodNutrient} from "@typing/app.type.ts";
import {createPortal} from "react-dom";

const NutrientsInfo: React.FC<Props> = ({nutrients, position}) => {
    return !nutrients?.length ? null : createPortal(
        <div style={{left: position?.x,top: position?.y }} className={classes.container}>
            {nutrients.map((nutrient) => (
               <div key={nutrient.id} className={classes["nutrient-container"]}>
                   <span className={classes["nutrient__name"]}>{nutrient.name}</span>
                   <span>{nutrient.value} {nutrient.unit}</span>
               </div>
            ))}
        </div>, document.body
    );
};

type Props = {
    nutrients?: FoodNutrient[]
    position?: {x: number, y: number}
}

export default NutrientsInfo;