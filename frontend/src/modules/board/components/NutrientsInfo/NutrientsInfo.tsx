import React from 'react';
import classes from "./NutrientsInfo.module.scss"
import {Nutrient} from "@typing/app.type.ts";

const NutrientsInfo: React.FC<Props> = ({nutrients}) => {
    return !nutrients?.length ? null : (
        <div className={classes.container}>
            {nutrients.map((nutrient) => (
               <div key={nutrient.id} className={classes["nutrient-container"]}>
                   <span className={classes["nutrient__name"]}>{nutrient.name}</span>
                   <span>{nutrient.value} {nutrient.unit}</span>
               </div>
            ))}
        </div>
    );
};

type Props = {
    nutrients?: Nutrient[]
}

export default NutrientsInfo;