import React from 'react';
import clsx from "clsx"
import classes from "./Summary.module.scss"
import {Nutrient} from "@typing/app.type.ts";

const Summary: React.FC<Props> = ({nutrients}) => {
    const valueClass = (DRI: Value, value: Value = {amount: 0, unit: "mcg"}) => {
        if (value.amount >= DRI.amount) {
            return "positive";
        }
        if (value.amount >= DRI.amount * 0.9) {
            return "limit"
        }
        return "negative"
    }
    return (
        <div className={classes.container}>
            {nutrients?.map(({name,value, DRI}) => (
                <div key={name} className={clsx(classes["nutrient-container"],
                    classes[`value--${valueClass(DRI, value)}`])}>
                    <span className={classes["nutrient__name"]}>{name}</span>
                    <span >
                        Total: {!value ? 0 : `${value.amount} ${value.unit}`}</span>
                    <span>DRI: {DRI.amount} {DRI.unit}</span>
                </div>
            ))}
        </div>
    );
};

type Value = {
    amount: number
    unit: string
}

type Props = {
    nutrients?: (Nutrient & {value?: Value})[]
}

export default Summary;