import React, {useId} from 'react';
import classes from "./Input.module.scss"

const Input: React.FC<Props> = ({label, required, right, ...props}) => {
    const id = useId();
    return (
        <div className={classes.container}>
            {!!label && <label htmlFor={id}>{label}{required && " *"}</label>}
            <div className={classes["input-container"]}>
                <input {...props} required={required} className={classes.input} id={id}/>
                {right}
            </div>
        </div>
    )
};

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label?: React.ReactNode
    right?: React.ReactNode
}
export default Input;