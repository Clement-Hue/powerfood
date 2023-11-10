import React, {useMemo} from 'react';
import {Button, Dialog, Input, Select} from "@shares";
import classes from "./FoodDialog.module.scss"
import {useForm, useNutrients} from "@hooks";
import {UnidentifiedFood, Unit} from "@typing/app.type.ts";

const FoodDialog: React.FC<Props> = ({open,onValidate, onClose,
                                         title = "Ajouter un aliment", initValues} ) => {
    const {nutrients} = useNutrients();
    const { setValues, register, handleSubmit, handleChange } = useForm<FormValues>({
        name: initValues?.name ?? "",
        description: initValues?.description ?? "",
        proteins: String(initValues?.proteins ?? 0),
        lipids: String(initValues?.lipids ?? 0),
        carbs: String(initValues?.carbs ?? 0),
        calories: String(initValues?.calories ?? 0)
    });

    useMemo(() => {
        if (nutrients) {
            setValues((prev) => ({
                ...prev,
                ...nutrients.reduce((prev, nutrient) => {
                    const init = initValues?.nutrients.find((n) => n.id === nutrient.id)
                    return {...prev,
                        [`value-${nutrient.id}`]: String(init?.amount ?? 0),
                        [`unit-${nutrient.id}`]: init?.unit ?? "mg"}
                }, {})
            }))
        }
    }, [initValues?.nutrients, nutrients, setValues]);


    const handleValidate = async (data: FormValues) => {
        onValidate?.({
            name: data["name"],
            proteins: Number(data["proteins"]),
            lipids: Number(data["lipids"]),
            carbs: Number(data["carbs"]),
            calories: Number(data["calories"]),
            nutrients: nutrients?.map((nutrient) => ({
                id: nutrient.id,
                name: nutrient.name,
                amount: Number(data[`value-${nutrient.id}`]),
                unit: data[`unit-${nutrient.id}`]
                })) ?? []
        })
    }

    const handleMacroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e)
        setValues((prev) => ({
            ...prev, calories: String(Number(prev.proteins) * 4 + Number(prev.carbs) * 4 + Number(prev.lipids) * 9)
        }))
    }

    return (
            <Dialog onClose={onClose} open={open} header={
                <span className={classes["title"]}>{title}</span>
            }
                    actions={
                        <>
                            <Button onClick={() => onClose?.()}>Fermer</Button>
                            <Button form="add-food-form" type="submit"> Valider</Button>
                        </>
                    }
            >
                <form id="add-food-form" onSubmit={handleSubmit(handleValidate)} className={classes["container"]}>
                    <Input {...register("name")} required label="Nom de l'aliment" />
                    <Input {...register("description")} label="Descripton" />
                    <div className={classes["macros-container"]}>
                        <Input {...register("proteins")} step=".01" onChange={handleMacroChange} required label="Protéines (g)" min={0}  type="number"/>
                        <Input {...register("carbs")} step=".01" onChange={handleMacroChange} required label="Glucides (g)" min={0}  type="number"/>
                        <Input {...register("lipids")} step=".01" onChange={handleMacroChange} required label="Lipides (g)" min={0}  type="number"/>
                        <Input {...register("calories")}  readOnly label="Calories" min={0}  type="number"/>
                    </div>
                    <div className={classes["nutrients-container"]}>
                        {nutrients?.map((nutrient) => (
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
            </Dialog>
    );
};

type FormValues = {
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
   open?: boolean
   title?: string
   onClose?: () => void
   onValidate?: (food: UnidentifiedFood) => void
   initValues?: UnidentifiedFood
}

export default FoodDialog;