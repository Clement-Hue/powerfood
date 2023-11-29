import React, {useState} from "react";
import { useAppSelector, useServices } from "@hooks";
import { MacrosInfo } from "@typing/app.type";
import * as d3 from "d3"
import classes from "./Macro.module.scss"
import NutrientGraph from "@modules/board/components/NutrientGraph";
import { daySelectors } from "@store/day";

const Macro: React.FC<Props> = ({macroInfo, dayName}) => {
	const [showGraph, setShowGraph] = useState(false);
	const {graphService} = useServices();
    const macrosCalories = useAppSelector((state) => daySelectors.selectMacrosCalories(state, dayName));
	const displayAmount = (value?: number) => value?.toLocaleString("en-US", {maximumFractionDigits: 2})

	const macroNames = {
		proteins: "Protéines",
		carbs: "Glucides",
		lipids: "Lipides",
		calories: "Calories"
		} as const
	return (
		<div  className={classes["macro-container"]} 
			onMouseEnter={() => setShowGraph(true)}
			onMouseLeave={() => setShowGraph(false)}
			>
			<li>
				{macroInfo.id === 'calories' ? (
					<div>
						{macroNames[macroInfo.id]} {displayAmount(macroInfo.amount)} kcal
					</div>
					): (
					<div className={classes["macro__details"]}>
							<div>
								{macroNames[macroInfo.id]} {displayAmount(macroInfo.amount)} g
							</div>
							<div>
							{Math.ceil(macrosCalories?.[macroInfo.id]?.calories ?? 0)} kcal
							</div>
							<div>
								{displayAmount(macrosCalories?.[macroInfo.id]?.percentage)}%
							</div>
						</div>
				)}
			</li>
			<NutrientGraph open={showGraph} title={macroNames[macroInfo.id]}
				graphFactory={(el) => new graphService.BarChart({
					el,
					data: macroInfo.foods.sort((a, b) => d3.descending(a.amount, b.amount)),
					y: (d) => d.amount,
					x: (d) => d.food.name,
					range: {
						yMin: 0
					}
			})}/>
		</div>
	)
}

type Props = {
	macroInfo: MacrosInfo
	dayName: string
}

export default Macro;
