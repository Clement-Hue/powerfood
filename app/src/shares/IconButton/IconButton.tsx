import React  from 'react';
import {IconBaseProps} from "react-icons";
import classes from "./IconButton.module.scss"

const IconButton: React.FC<Props> = ({Icon, "aria-label": label, ...props}) => {
    return (
        <button type="button" {...props} aria-label={label} title={label} className={classes.container}>
            <Icon />
        </button>
    );
};

type Props = {
    Icon: React.ComponentType<IconBaseProps>
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "title">
export default IconButton;