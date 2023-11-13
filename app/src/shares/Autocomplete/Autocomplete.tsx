import React, {useId} from 'react';
import Select from 'react-select';

const Autocomplete = <T extends unknown> ({options, helpText, label, onInputChange, onChange, disabled, ...props}: Props<T>) => {
    const id = useId();
    return (
        <div>
            {label && <label htmlFor={id} >{label}</label>}
            <Select id={id} onInputChange={(value) => onInputChange?.(value)} onChange={(value) => onChange?.(value)}
                    isMulti={false} isClearable isSearchable options={options} isDisabled={disabled} {...props} />
            <div className="small-typo">{helpText}</div>
        </div>
    );
};
type Props<T> = {
    options?: T[]
    helpText?: React.ReactNode
    autoFocus?: boolean
    disabled?: boolean
    label?: string
    name?: string
    noOptionsMessage?: (obj: {inputValue: string}) => React.ReactNode
    value?: T | null
    onChange?: (value: T | null) => void
    inputValue?: string
    onInputChange?: (value: string) => void
    placeholder?: string
}

export default Autocomplete;