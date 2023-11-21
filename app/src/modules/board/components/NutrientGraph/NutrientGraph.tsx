import React from 'react';
import {createPortal} from "react-dom";
import classes from "./NutrientGraph.module.scss"

const NutrientGraph: React.FC<Props> = ({position}) => {
    return createPortal(
        <div role="tooltip" className={classes.container} style={{left: position?.x,top: position?.y }} >

        </div>, document.body
    );
};

type Props = {
    position: {x: number, y: number}
    nutrientId: string
}
export default NutrientGraph;