import React, {useState} from 'react';
import {clsx} from "clsx"
import classes from "./Summary.module.scss"
import {NutrientInfo, MeasurementValue} from "@typing/app.type.ts";
import NutrientGraph from "../NutrientGraph";

const Summary: React.FC<Props> = ({micros, macros}) => {
    const [showNutrientGraph, setShowNutrientGraph] = useState<{pos: {x: number, y:number}, nutId: string} | null>(null)
    const valueClass = (DRI: MeasurementValue, value: MeasurementValue = {amount: 0, unit: "mcg"}) => {
        if (value.amount >= DRI.amount) {
            return "positive";
        }
        if (value.amount >= DRI.amount * 0.8) {
            return "limit"
        }
        return "negative"
    }

    const macroVisualName = {
        proteins: "Protéines",
        carbs: "Glucides",
        lipids: "Lipides",
        calories: "Calories"
    }
    const displayAmount = (value: number) => parseFloat(value.toFixed(3)).toString()
    return (
        <div role="region" aria-label="Résultat" className={classes.container}>
            <ul className={classes["macros-container"]}>
                {macros?.map((macro) => (
                    <li key={macro.name} >{macroVisualName[macro.name]} {displayAmount(macro.amount)}{macro.name === "calories" ? "kcal": "g"}</li>
                ))}
            </ul>
            <ul className={classes["micros-container"]}>
                {micros?.map(({id: nutId,name,value, DRI}) => (
                    <li key={name} className={clsx(classes["nutrient-container"],
                        classes[`value--${valueClass(DRI, value)}`])}
                         onMouseEnter={(e) => setShowNutrientGraph({
                             pos: {x: e.clientX, y: e.clientY}, nutId
                         })}
                        onMouseLeave={() => setShowNutrientGraph(null)}
                        aria-labelledby={`nutId-${nutId}`}
                    >
                        <span id={`nutId-${nutId}`} className={classes["nutrient__name"]}>{name}</span>
                        <span> Total: {!value ? 0 : `${displayAmount(value.amount)} ${value.unit}`}</span>
                        <span>DRI: {DRI.amount} {DRI.unit}</span>
                        {showNutrientGraph?.nutId === nutId && <NutrientGraph position={showNutrientGraph.pos} nutrientId={nutId} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

type Macro = {
    name: "proteins" | "carbs" | "lipids" | "calories"
    amount: number
}

type Props = {
    micros?: (NutrientInfo & {value?: MeasurementValue})[]
    macros?: Macro[]
}

export default Summary;