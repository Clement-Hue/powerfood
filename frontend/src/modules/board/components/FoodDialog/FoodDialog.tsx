import React from 'react';
import {Button, Dialog, Input, Select} from "@shares";
import classes from "./FoodDialog.module.scss"
import {useFetch, useForm, useServices} from "@hooks";
import {UnidentifiedFood, Unit} from "@typing/app.type.ts";

const FoodDialog: React.FC<Props> = ({open,onValidate, onClose, title = "Ajouter un aliment"} ) => {
    const {apiService} = useServices();
    const { setValues, register, handleSubmit, handleChange } = useForm<FormValues>({
        name: "",
        description: "",
        proteins: "0",
        lipids: "0",
        carbs: "0",
        calories: "0",
    });
    const [nutrients] = useFetch(async () => {
        const res = await apiService.getNutrients()
        setValues((prev) => ({
            ...prev,
            ...res.reduce((prev, nutrient) => {
                return {...prev, [`value-${nutrient.id}`]: 0, [`unit-${nutrient.id}`]: "mcg"}
            }, {})
        }))
        return res;
    })

    const handleValidate = async (data: FormValues) => {
        const nutrientsData = nutrients?.map((nutrient) => {
            return {
                id: nutrient.id,
                name: nutrient.name,
                value: Number(data[`value-${nutrient.id}`]),
                unit: data[`unit-${nutrient.id}`]
            }
        })
        const food = {
            name: data["name"],
            proteins: Number(data["proteins"]),
            lipids: Number(data["lipids"]),
            carbs: Number(data["carbs"]),
            calories: Number(data["calories"]),
            nutrients: nutrientsData ?? []
        }
        onValidate?.(food);
    }

    const handleMacroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e)
        setValues((prev) => ({
            ...prev, calories: String(Number(prev.proteins) * 4 + Number(prev.carbs) * 4 + Number(prev.lipids) * 9)
        }))
    }

    return (
            <Dialog open={open} header={
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
                        <Input {...register("proteins")} onChange={handleMacroChange} required label="Protéines (g)" min={0}  type="number"/>
                        <Input {...register("carbs")} onChange={handleMacroChange} required label="Glucides (g)" min={0}  type="number"/>
                        <Input {...register("lipids")} onChange={handleMacroChange} required label="Lipides (g)" min={0}  type="number"/>
                        <Input {...register("calories")} readOnly label="Calories" min={0}  type="number"/>
                    </div>
                    <div className={classes["nutrients-container"]}>
                        {nutrients?.map((nutrient) => (
                            <div key={nutrient.id}>
                                <Input {...register(`value-${nutrient.id}`)} min={0} type="number" label={nutrient.name}/>
                                <Select {...register(`unit-${nutrient.id}`)} placeholder="Unité" options={[
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
}

export default FoodDialog;