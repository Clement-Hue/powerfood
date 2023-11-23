import React, { useEffect, useRef } from 'react';
import {createPortal} from "react-dom";
import * as d3 from "d3";
import classes from "./NutrientGraph.module.scss"
/* import { useAppSelector } from '@hooks';
import { daySelectors } from '@store/day'; */

const NutrientGraph: React.FC<Props> = ({position}) => {
    const svgRef = useRef(null);
    // const micros = useAppSelector(daySelectors.selectMicrosFoods);
    useEffect(() => {
        const container = d3.select(svgRef.current)
        container.attr("width", 500)
        .attr("height", 300)
        .append("g")
        
    }, [])
    return createPortal(
        <div role="tooltip" className={classes.container} style={{left: position?.x,top: position?.y }} >
            <svg ref={svgRef}/>
                
        </div>, document.body
    );
};

type Props = {
    position: {x: number, y: number}
    nutrientId: string
}

export default NutrientGraph;
