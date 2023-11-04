import React from 'react';
import classes from "./Button.module.scss"

const Button: React.FC<Props> = (props) => {
    return (
        <button type="button" {...props} className={classes.container}/>
    );
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export default Button;