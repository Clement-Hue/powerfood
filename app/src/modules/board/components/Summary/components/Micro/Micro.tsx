import React, { useState } from "react";
import clsx from "clsx"
import * as d3 from "d3"
import classes from "./Micro.module.scss"
import { MicrosInfo, MeasurementValue } from "@typing/app.type";
import { useServices } from "@hooks";
import NutrientGraph from "@modules/board/components/NutrientGraph";



const Micro: React.FC<Props> = ({microInfo}) => {
	const [showGraph, setShowGraph] = useState(false);
	const {graphService} = useServices()
	const displayAmount = (value?: number) => value?.toLocaleString("en-US", {maximumFractionDigits: 2})
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
		<li className={clsx(classes["micro-container"],
			classes[`value--${valueClass(microInfo.DRI, microInfo.value)}`])}
			onMouseEnter={() => setShowGraph(true)}
			onMouseLeave={() => setShowGraph(false)}
			aria-labelledby={`nutId-${microInfo.id}`}
			>
			<span id={`nutId-${microInfo.id}`} className={classes["nutrient__name"]}>{microInfo.name}</span>
			<span> Total: {!microInfo.value ? 0 : `${displayAmount(microInfo.value.amount)} ${microInfo.value.unit}`}</span>
			<span>DRI: {microInfo.DRI.amount} {microInfo.DRI.unit}</span>
			<NutrientGraph open={showGraph} title={microInfo.name}
				graphFactory={(el) => new graphService.BarChart({
					el,
					data: microInfo.foods.sort((a, b) => d3.descending(a.amount, b.amount)),
					y: (d) => d.amount,
					x: (d) => d.food.name,
					range: {
						yMin: 0
					}
			}) }/>
		</li>
	)
}

type Props = {
	microInfo: MicrosInfo
}
export default Micro;
