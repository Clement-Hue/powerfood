import React  from 'react';
import {IconBaseProps} from "react-icons";
import classes from "./IconButton.module.scss"

const IconButton: React.FC<Props> = ({Icon, ...props}) => {
    return (
        <button type="button" {...props} className={classes.container}>
            <Icon />
        </button>
    );
};

type Props = {
    Icon: React.ComponentType<IconBaseProps>
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">
export default IconButton;