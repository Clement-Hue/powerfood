import React from 'react';
import classes from "./Dialog.module.scss"
import {createPortal} from "react-dom";

const Dialog: React.FC<Props> = ({children}) => {
    return  createPortal(
        <div className={classes.container} role="dialog">
            {children}
        </div>
    , document.body);
};
type Props = {
    children?: React.ReactNode
}
export default Dialog;