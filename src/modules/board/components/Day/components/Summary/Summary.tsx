import React from 'react';
import classes from "./Summary.module.scss"

const Summary: React.FC<Props> = ({nutrients}) => {
    return (
        <div className={classes.container}>
            {nutrients?.map(({name,value, DRI}) => (
                <div className={classes["nutrient-container"]}>
                    {name}
                    {value}
                    {DRI}
                </div>
            ))}
        </div>
    );
};

type Props = {
    /** DRI in mcg */
    nutrients?: {name: string, DRI: number, value: number}[]
}

export default Summary;