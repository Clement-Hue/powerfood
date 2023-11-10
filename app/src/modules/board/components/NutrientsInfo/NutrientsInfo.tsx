import React from 'react';
import classes from "./NutrientsInfo.module.scss"
import {Food} from "@typing/app.type.ts";
import {createPortal} from "react-dom";

const NutrientsInfo: React.FC<Props> = ({food, position}) => {
    const macros = [
        {name: "Calories", value: food?.calories, unit: "cal"},
        {name: "Protéines", value: food?.proteins, unit: "g"},
        {name: "Glucides", value: food?.carbs, unit: "g"},
        {name: "Lipides", value: food?.lipids, unit: "g"},
    ]
    return !food ? null : createPortal(
        <div aria-label={`Information sur ${food.name}`} role="tooltip" style={{left: position?.x,top: position?.y }} className={classes.container}>
            <div className={classes["macro-container"]}>
                {macros.map((macro) => (
                    <div key={macro.name} className={classes["nutrient-container"]}>
                        <span className={classes["nutrient__name"]}>{macro.name}</span>
                        <span>{macro.value} {macro.unit}</span>
                    </div>
                ))}
            </div>
            <div className={classes["micro-container"]}>
                {food.nutrients.map((nutrient) => (
                    <div key={nutrient.id} className={classes["nutrient-container"]}>
                        <span className={classes["nutrient__name"]}>{nutrient.name}</span>
                        <span>{nutrient.value} {nutrient.unit}</span>
                    </div>
                ))}
            </div>
        </div>, document.body
    );
};

type Props = {
    food?: Food
    position?: {x: number, y: number}
}

export default NutrientsInfo;