import React, {useId} from 'react';
import classes from "./Input.module.scss"

const Input: React.FC<Props> = ({label, ...props}) => {
    const id = useId();
    return (
        <div className={classes.container}>
            {!!label && <label htmlFor={id}>{label}</label>}
            <input {...props} className={classes.input} id={id}/>
        </div>
    )
};

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label?: React.ReactNode
}
export default Input;