import React, {useState} from "react";

export default function <T extends object>(initValues: T) {
    const [values, setValues] = useState<T>(initValues);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
       setValues((prev) => ({
           ...prev, [e.target.name]: e.target.value
       }))
    }

    function register(name: keyof typeof initValues) {
        return {name, onChange: handleChange, value: values[name]}
    }

    function handleSubmit(callback: (v: T) => Promise<void>) {
       return async  (e: React.FormEvent<HTMLFormElement>) => {
           e.preventDefault()
           await callback(values);
       }
    }

    return {values, register, setValues, handleSubmit}
}