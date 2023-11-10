import React, {useId} from 'react';
import classes from "./Dialog.module.scss"
import ReactModal from "react-modal"

if (process.env.NODE_ENV !== 'test') {
    ReactModal.setAppElement("#root");
}
const Dialog: React.FC<Props> = ({children, onClose, header, actions, open = false}) => {
    const headerId = useId();
    return (
        <ReactModal
            aria={{labelledby: headerId}}
            ariaHideApp={process.env.NODE_ENV !== "test"}
            onRequestClose={onClose} isOpen={open} className={classes.container} shouldCloseOnOverlayClick={false} >
            <div id={headerId}>
                {header}
            </div>
            <div className={classes["content-container"]}>
                {children}
            </div>
            <div className={classes["actions-container"]}>
                {actions}
            </div>
        </ReactModal>
    )
};
type Props = {
    open?: boolean
    onClose?: () => void
    header?: React.ReactNode
    children?: React.ReactNode
    actions?: React.ReactNode
}
export default Dialog;