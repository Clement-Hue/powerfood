import React, { useEffect, useId, useRef } from 'react';
import * as d3 from "d3";
import classes from "./NutrientGraph.module.scss"
import { useAppSelector, useServices } from '@hooks';
import { daySelectors } from '@store/day';
import clsx from 'clsx';

const NutrientGraph: React.FC<Props> = ({ nutrientId, dayName, open: show = false}) => {
    const graphContainerRef = useRef(null);
    const micros = useAppSelector((state) => daySelectors.selectMicros(state, dayName));
    const titleId = useId();
    const nutrientInfo = micros?.find((m) => m.id === nutrientId);
    const {graphService} = useServices()

    useEffect(() => {
        if (!nutrientInfo || !graphContainerRef.current){
            return;
        }
        const barChart = new graphService.BarChart({
            data: nutrientInfo.foods.sort((a, b) => d3.descending(a.amount, b.amount)),
            el: graphContainerRef.current,
            y: (d) => d.amount,
            x: (d) => d.food.name,
            range: {
                yMin: 0
            }
        })
        barChart.create()
        return () => {
            barChart.remove()
        }
    }, [graphService.BarChart, nutrientInfo])


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
