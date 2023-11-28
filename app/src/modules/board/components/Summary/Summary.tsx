import React, {useState} from 'react';
import {clsx} from "clsx"
import * as d3 from "d3";
import classes from "./Summary.module.scss"
import {MeasurementValue} from "@typing/app.type.ts";
import NutrientGraph from "../NutrientGraph";
import { useAppSelector, useServices } from '@hooks';
import { daySelectors } from '@store/day';

const Summary: React.FC<Props> = ({dayName}) => {
    const macros = useAppSelector((state) => daySelectors.selectMacros(state, dayName))
    const micros = useAppSelector((state) => daySelectors.selectMicros(state, dayName))
    const {graphService} = useServices()

    const [showNutrientGraph, setShowNutrientGraph] = useState<{nutId: string} | null>(null)
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
    } as const
    const displayAmount = (value: number) => value.toLocaleString("en-US", {maximumFractionDigits: 2})
    return (
        <div role="region" aria-label="Résultat" className={classes.container}>
            <ul className={classes["macros-container"]}>
                {macros?.map((macro) => (
                    <div className={classes["macro-container"]} 
                        onMouseEnter={() => setShowNutrientGraph({ nutId: macro.id })}
                        onMouseLeave={() => setShowNutrientGraph(null)}
                    >
                        <li
                            key={macro.id} >{macroVisualName[macro.id]} {displayAmount(macro.amount)}{macro.id === "calories" ? "kcal": "g"}</li>
                        <NutrientGraph open={showNutrientGraph?.nutId === macro.id} title={macroVisualName[macro.id]}
                            graphFactory={(el) => new graphService.BarChart({
                                el,
                                data: macro.foods.sort((a, b) => d3.descending(a.amount, b.amount)),
                                y: (d) => d.amount,
                                x: (d) => d.food.name,
                                range: {
                                    yMin: 0
                                }
                            }) }/>
                    </div>
                ))}
            </ul>
            <ul className={classes["micros-container"]}>
                {micros?.map((micro) => {
                    return (
                        <li key={micro.name} className={clsx(classes["micro-container"],
                            classes[`value--${valueClass(micro.DRI, micro.value)}`])}
                            onMouseEnter={() => setShowNutrientGraph({ nutId: micro.id })}
                            onMouseLeave={() => setShowNutrientGraph(null)}
                            aria-labelledby={`nutId-${micro.id}`}
                        >
                            <span id={`nutId-${micro.id}`} className={classes["nutrient__name"]}>{micro.name}</span>
                            <span> Total: {!micro.value ? 0 : `${displayAmount(micro.value.amount)} ${micro.value.unit}`}</span>
                            <span>DRI: {micro.DRI.amount} {micro.DRI.unit}</span>
                            <NutrientGraph open={showNutrientGraph?.nutId === micro.id} title={micro.name}
                                graphFactory={(el) => new graphService.BarChart({
                                    el,
                                    data: micro.foods.sort((a, b) => d3.descending(a.amount, b.amount)),
                                    y: (d) => d.amount,
                                    x: (d) => d.food.name,
                                    range: {
                                        yMin: 0
                                    }
                                }) }/>
                        </li>
                    )})}
            </ul>
        </div>
    );
};


type Props = {
    dayName: string
}

export default Summary;
