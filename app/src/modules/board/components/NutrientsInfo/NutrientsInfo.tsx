import React from 'react';
import classes from "./NutrientsInfo.module.scss"
import {Food} from "@typing/app.type.ts";
import * as d3 from "d3";
import {createPortal} from "react-dom";
import { displayAmount } from '@utils';
import { useServices, useGraph } from '@hooks';

const NutrientsInfo: React.FC<Props> = ({food, position}) => {
    const macros = [
        {name: "Calories", amount: food?.calories, unit: "kcal"},
        {name: "Protéines", amount: food?.proteins, unit: "g"},
        {name: "Glucides", amount: food?.carbs, unit: "g"},
        {name: "Lipides", amount: food?.lipids, unit: "g"},
    ]
    const {graphService} = useServices()
    const graphContainerRef = useGraph((el) => {
        return new graphService.BarChart({
            el,
            data: food.nutrients.sort((a, b) => d3.descending(a.percentage, b.percentage)),
            y: (d) => d.percentage,
            x: (d) => d.name,
            range: {
                yMin: 0,
            },
            textFormat: (d) => d.percentage.toLocaleString("en-US", {maximumFractionDigits: 0})
        }, {
                width:1000,
                height: 250
            })
    })
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
                            <span>{displayAmount(macro.amount)} {macro.unit}</span>
                        </div>
                    ))}
                </div>
                <div className={classes["micro-container"]}>
                    <div ref={graphContainerRef}/>
                </div>
            </div>
        </div>, document.body
    );
};

type Props = {
    food: Food
    position?: {x: number, y: number}
}

export default NutrientsInfo;
