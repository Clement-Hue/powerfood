import React from 'react';
import classes from "./Dialog.module.scss"
import {createPortal} from "react-dom";

const Dialog: React.FC<Props> = ({children, open}) => {
    return !open ? null :  createPortal(
        <div className={classes.container} role="dialog">
            {children}
        </div>
    , document.body);
};
type Props = {
    open?: boolean
    children?: React.ReactNode
}
export default Dialog;