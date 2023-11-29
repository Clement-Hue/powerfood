import React, { useEffect, useId, useRef } from 'react';
import classes from "./NutrientGraph.module.scss"
import clsx from 'clsx';
import { Graph } from '@typing/internal.type';

const NutrientGraph: React.FC<Props> = ({ open = false, graphFactory , title}) => {
    const graphContainerRef = useRef(null);
    const titleId = useId();

    useEffect(() => {
        if (!graphContainerRef.current){
            return;
        }
        const graph = graphFactory?.(graphContainerRef.current)
        graph?.create()
        return () => {
            graph?.remove()
        }
    }, [graphFactory])


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
