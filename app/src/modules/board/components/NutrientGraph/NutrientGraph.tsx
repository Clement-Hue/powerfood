import React, { useId } from 'react';
import classes from "./NutrientGraph.module.scss"
import clsx from 'clsx';
import { Graph } from '@typing/internal.type';
import useGraph from 'src/hooks/useGraph';

const NutrientGraph: React.FC<Props> = ({ open = false, graphFactory , title}) => {
    const graphContainerRef = useGraph(graphFactory)
    const titleId = useId();
    
    return (
        <div role="tooltip" aria-labelledby={titleId} className={clsx(classes.container, {
            [classes.show]: open
        })}>
            <div className='title2-typo' id={titleId}>{title}</div>
            <div ref={graphContainerRef}/>
        </div>
    );
};

type Props = {
    open?: boolean
    graphFactory?: (el: HTMLElement) => Graph
    title?: React.ReactNode
}

export default NutrientGraph;
