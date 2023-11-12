import React from 'react';
import {clsx} from "clsx"
import classes from "./Summary.module.scss"
import {NutrientInfo, MeasurementValue} from "@typing/app.type.ts";

const Summary: React.FC<Props> = ({nutrients}) => {
    const valueClass = (DRI: MeasurementValue, value: MeasurementValue = {amount: 0, unit: "mcg"}) => {
        if (value.amount >= DRI.amount) {
            return "positive";
        }
        if (value.amount >= DRI.amount * 0.8) {
            return "limit"
        }
        return "negative"
    }
    return (
        <ul aria-label="Résultat" className={classes.container}>
            {nutrients?.map(({name,value, DRI}) => (
                <div key={name} className={clsx(classes["nutrient-container"],
                    classes[`value--${valueClass(DRI, value)}`])}>
                    <span className={classes["nutrient__name"]}>{name}</span>
                    <span> Total: {!value ? 0 : `${parseFloat(value.amount.toFixed(3)).toString()} ${value.unit}`}</span>
                    <span>DRI: {DRI.amount} {DRI.unit}</span>
                </div>
            ))}
        </ul>
    );
};

type Props = {
    nutrients?: (NutrientInfo & {value?: MeasurementValue})[]
}

export default Summary;