import React from 'react';
import {clsx} from "clsx"
import classes from "./Button.module.scss"

const Button: React.FC<Props> = ({variant = 'primary', ...props}) => {
    return (
        <button type="button" {...props} className={clsx(classes.container,
            classes[`variant-${variant}`])}/>
    );
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "tertiary"
}

export default Button;