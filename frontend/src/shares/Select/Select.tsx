import React, {useId} from 'react';
import classes from "./Select.module.scss"

const Select: React.FC<Props> = ({options, label, ...props}) => {
    const id = useId();
    return (
        <div className={classes.container}>
            <label htmlFor={id}>{label}</label>
            <select {...props} id={id}>
                {options?.map(({value, label}) => (
                    <option value={value}>{label}</option>
                ))}
            </select>
        </div>
    );
};

type Props = {
    options?: {value: string | number, label: string}[]
    label?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>

export default Select;