import React from 'react';
import classes from "./NutrientsInfo.module.scss"
import {Food} from "@typing/app.type.ts";
import {createPortal} from "react-dom";

const NutrientsInfo: React.FC<Props> = ({food, position}) => {
    const macros = [
        {name: "Calories", amount: food?.calories, unit: "kcal"},
        {name: "Protéines", amount: food?.proteins, unit: "g"},
        {name: "Glucides", amount: food?.carbs, unit: "g"},
        {name: "Lipides", amount: food?.lipids, unit: "g"},
    ]
    return !food ? null : createPortal(
        <div aria-label={`Information sur ${food.name}`} role="tooltip" style={{left: position?.x,top: position?.y }} className={classes.container}>
            <div>
                <div className="title2-typo">{food.name}</div>
                <div >Valeurs pour {food.valuesFor === "unit" ? "1 unité" : "100g"}</div>
                <div className="small-typo">{food.description}</div>
            </div>
            <div className={classes["info-container"]}>
                <div className={classes["macro-container"]}>
                    {macros.map((macro) => (
                        <div key={macro.name} className={classes["nutrient-container"]}>
                            <span className={classes["nutrient__name"]}>{macro.name}</span>
                            <span>{macro.amount} {macro.unit}</span>
                        </div>
                    ))}
                </div>
                <div className={classes["micro-container"]}>
                    {food.nutrients.map((nutrient) => (
                        <div key={nutrient.id} className={classes["nutrient-container"]}>
                            <span className={classes["nutrient__name"]}>{nutrient.name}</span>
                            <span>{nutrient.amount} {nutrient.unit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>, document.body
    );
};

type Props = {
    food?: Food
    position?: {x: number, y: number}
}

export default NutrientsInfo;