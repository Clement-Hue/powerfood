import React from 'react';
import classes from "./Day.module.scss"
import {Summary} from "./components";

const Day: React.FC<Props> = ({name, children}) => {
    return (
        <div className={classes.container}>
            <div className={classes["day__name"]}>
                {name}
            </div>
            <div className={classes["meals-container"]}>
                {children}
            </div>
            <Summary/>
        </div>
    );
};

type Props = {
    name: string
    children?: React.ReactNode
}

export default Day;