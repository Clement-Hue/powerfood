import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import * as d3 from "d3";
import classes from "./NutrientGraph.module.scss"
import { useAppSelector } from '@hooks';
import { daySelectors } from '@store/day';
import clsx from 'clsx';

const NutrientGraph: React.FC<Props> = ({ nutrientId, dayName, open: show = false}) => {
    const graphContainerRef = useRef(null);
    const chartProps = useMemo(() => ({
        width: 500, height: 300, margin: {
            top: 30, right: 30, bottom: 130, left:60
        }
    }), []);
    const micros = useAppSelector((state) => daySelectors.selectMicrosFoods(state, dayName));
    const titleId = useId();
    const nutrientInfo = micros?.find((m) => m.id === nutrientId);

    const makeGraph = useCallback(() => {
        if (!nutrientInfo) {
            return;
        }
        const fontSize = "1.2rem";
        const container = d3.select(graphContainerRef.current)
            .append("svg")
            .attr("width", chartProps.width + chartProps.margin.left + chartProps.margin.right)
            .attr("height", chartProps.height + chartProps.margin.top + chartProps.margin.bottom)
            .append("g")
            .attr("transform", `translate(${chartProps.margin.left}, ${chartProps.margin.top})`)

        const xAxis = d3.scaleBand()
            .range([0, chartProps.width])
            .domain(nutrientInfo.foods.sort((a, b) => d3.descending(a.amount, b.amount)).map((f) => f.food.name))
            .padding(0.2)

        const yAxis = d3.scaleLinear()
            .range([chartProps.height, 0])
            .domain([0, Math.max(...nutrientInfo.foods.map((f) => f.amount))])

        container.append("g")
            .attr("transform", `translate(0, ${chartProps.height})`)
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .attr("transform", "translate(-10,0) rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", fontSize)

        container.append("g")
            .call(d3.axisLeft(yAxis))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", fontSize)

        container.selectAll("bar")
            .data(nutrientInfo.foods)
            .enter()
            .append("rect")
            .attr("x", (d) => xAxis(d.food.name) ?? "")
            .attr("y", (d) => yAxis(d.amount))
            .attr("width", xAxis.bandwidth())
            .attr("height", (d) => chartProps.height - yAxis(d.amount))
            .attr("fill", "var(--dark-primary)")
    }, [chartProps, nutrientInfo])

    useEffect(() => {
       makeGraph() 
        return () => {
            d3.select(graphContainerRef.current).selectAll("*").remove()
        }
    }, [makeGraph])


    return (
        <div role="tooltip" aria-labelledby={titleId} className={clsx(classes.container, {
            [classes.show]: show
        })} >
            <div className='title2-typo' id={titleId}>{nutrientInfo?.name}</div>
            <div ref={graphContainerRef}/>
        </div>
    );
};

type Props = {
    dayName: string
    nutrientId: string
    open?: boolean
}

export default NutrientGraph;
