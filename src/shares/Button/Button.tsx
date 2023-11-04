import React from 'react';
import classes from "./Button.module.scss"

const Button: React.FC<Props> = (props) => {
    return (
        <button {...props} className={classes.container}/>
    );
};

type Props = React.HTMLAttributes<HTMLButtonElement>

export default Button;