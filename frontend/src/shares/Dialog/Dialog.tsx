import React from 'react';
import classes from "./Dialog.module.scss"
import {createPortal} from "react-dom";

const Dialog: React.FC<Props> = ({children, header, actions, open}) => {
    return !open ? null :  createPortal(
        <div className={classes.container} aria-modal="true" role="dialog">
            <div>
                {header}
            </div>
            <div className={classes["content-container"]}>
                {children}
            </div>
            <div className={classes["actions-container"]}>
                {actions}
            </div>
        </div>
    , document.body);
};
type Props = {
    open?: boolean
    header?: React.ReactNode
    children?: React.ReactNode
    actions?: React.ReactNode
}
export default Dialog;