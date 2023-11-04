import React, {useId} from 'react';
import classes from "./Input.module.scss"

const Input: React.FC<Props> = ({label, ...props}) => {
    const id = useId();
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input {...props} id={id}/>
        </>
    )
};

type Props = Omit<React.HTMLAttributes<HTMLInputElement>, "id"> & {
    label?: React.ReactNode
}
export default Input;