import React from 'react';
import classes from "./Day.module.scss"
import {Summary} from "./components";
import DRI from "src/DRI.json"
import {Button} from "@shares";

const Day: React.FC<Props> = ({name, children}) => {
    return (
        <div className={classes.container}>
            <div className={classes["day__name"]}>
                {name}
            </div>
            <Button>Ajouter un repas</Button>
            <div className={classes["meals-container"]}>
                {children}
            </div>
            <Summary nutrients={DRI}/>
        </div>
    );
};

type Props = {
    name: string
    children?: React.ReactNode
}

export default Day;