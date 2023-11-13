import React, {useId} from 'react';
import Select, {GroupBase, OptionsOrGroups} from 'react-select';

const Autocomplete = <T extends unknown> ({options, helpText, label, onInputChange, onChange, disabled, ...props}: Props<T>) => {
    const id = useId();
    return (
        <div>
            {label && <label htmlFor={id} >{label}</label>}
            <Select id={id} onInputChange={(value) => onInputChange?.(value)} onChange={(value) => onChange?.(value)} isSearchable options={options} isDisabled={disabled} {...props} />
            <div className="small-typo">{helpText}</div>
        </div>
    );
};
type Props<T> = {
    options?: OptionsOrGroups<T, GroupBase<T>>
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
}

export default Autocomplete;