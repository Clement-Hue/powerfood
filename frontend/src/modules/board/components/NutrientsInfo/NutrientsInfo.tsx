import React from 'react';
import classes from "./NutrientsInfo.module.scss"
import {Food} from "@typing/app.type.ts";
import {createPortal} from "react-dom";

const NutrientsInfo: React.FC<Props> = ({food, position}) => {
    return !food?.nutrients?.length ? null : createPortal(
        <div aria-label={`Information sur ${food.name}`} role="tooltip" style={{left: position?.x,top: position?.y }} className={classes.container}>
            {food.nutrients.map((nutrient) => (
               <div key={nutrient.id} className={classes["nutrient-container"]}>
                   <span className={classes["nutrient__name"]}>{nutrient.name}</span>
                   <span>{nutrient.value} {nutrient.unit}</span>
               </div>
            ))}
        </div>, document.body
    );
};

type Props = {
    food?: Food
    position?: {x: number, y: number}
}

export default NutrientsInfo;