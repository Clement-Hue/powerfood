import React from 'react';
import {NutrientInfo, UnidentifiedFood, Unit} from "@typing/app.type.ts";
import {useForm} from "@hooks";
import {Input, Select} from "@shares";
import classes from "./FoodForm.module.scss"

const FoodForm: React.FC<Props> = ({nutrients, onValidate, initValues, formId}) => {
    const {setValues, register, handleSubmit, handleChange } = useForm<FormValues>({
        name: initValues?.name ?? "",
        description: initValues?.description ?? "",
        proteins: String(initValues?.proteins ?? 0),
        lipids: String(initValues?.lipids ?? 0),
        carbs: String(initValues?.carbs ?? 0),
        calories: String(initValues?.calories ?? 0),
        ...nutrients.reduce((prev, nutrient) => {
            const init = initValues?.nutrients.find((n) => n.id === nutrient.id)
            return {...prev,
                [`value-${nutrient.id}`]: String(init?.amount ?? 0),
                [`unit-${nutrient.id}`]: init?.unit ?? "mg"}
        }, {})
    });

    const handleMacroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e)
        setValues((prev) => ({
            ...prev, calories: String(Number(prev.proteins) * 4 + Number(prev.carbs) * 4 + Number(prev.lipids) * 9)
        }))
    }
    return (
            <form id={formId} onSubmit={handleSubmit(onValidate)} className={classes["container"]}>
                <Input {...register("name")} autoFocus required label="Nom de l'aliment" />
                <Input {...register("description")} label="Descripton" />
                <div className={classes["macros-container"]}>
                    <Input {...register("proteins")} step=".01" onChange={handleMacroChange} required label="Protéines (g)" min={0}  type="number"/>
                    <Input {...register("carbs")} step=".01" onChange={handleMacroChange} required label="Glucides (g)" min={0}  type="number"/>
                    <Input {...register("lipids")} step=".01" onChange={handleMacroChange} required label="Lipides (g)" min={0}  type="number"/>
                    <Input {...register("calories")}  readOnly label="Calories" min={0}  type="number"/>
                </div>
                <div className={classes["nutrients-container"]}>
                    {nutrients.map((nutrient) => (
                        <div key={nutrient.id}>
                            <Input {...register(`value-${nutrient.id}`)} step=".01" min={0} type="number" label={nutrient.name}/>
                            <Select {...register(`unit-${nutrient.id}`)} aria-label={`${nutrient.name} unité`} placeholder="Unité" options={[
                                {label: "mcg", value: "mcg"},
                                {label: "mg", value: "mg"},
                                {label: "g", value: "g"},
                            ]}/>
                        </div>
                    ))}
                </div>
            </form>
    );
};

export type FormValues = {
    name: string
    description: string
    proteins: string
    lipids: string
    carbs: string
    calories: string
    [value: `value-${number}`]: string
    [unit: `unit-${number}`]: Unit
}

type Props = {
    initValues?: UnidentifiedFood | null
    nutrients: NutrientInfo[]
    onValidate: (data: FormValues) => Promise<void>
    formId?: string
}

export default FoodForm;