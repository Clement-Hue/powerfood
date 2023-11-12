import React from 'react';
import {clsx} from "clsx"
import classes from "./Summary.module.scss"
import {NutrientInfo, MeasurementValue} from "@typing/app.type.ts";

const Summary: React.FC<Props> = ({micros, macros}) => {
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
        <ul aria-label="Résultat" className={classes.container}>
            <div className={classes["macros-container"]}>
                {macros?.map((macro) => (
                    <span key={macro.name} >{macroVisualName[macro.name]} {displayAmount(macro.amount)}{macro.name === "calories" ? "kcal": "g"}</span>
                ))}
            </div>
            <div className={classes["micros-container"]}>
                {micros?.map(({name,value, DRI}) => (
                    <div key={name} className={clsx(classes["nutrient-container"],
                        classes[`value--${valueClass(DRI, value)}`])}>
                        <span className={classes["nutrient__name"]}>{name}</span>
                        <span> Total: {!value ? 0 : `${displayAmount(value.amount)} ${value.unit}`}</span>
                        <span>DRI: {DRI.amount} {DRI.unit}</span>
                    </div>
                ))}
            </div>
        </ul>
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