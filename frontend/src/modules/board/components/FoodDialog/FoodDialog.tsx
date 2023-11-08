import React from 'react';
import {Button, Dialog, Input, Select} from "@shares";
import classes from "./FoodDialog.module.scss"
import {useFetch, useServices} from "@hooks";
const FoodDialog: React.FC<Props> = ({open, onClose, title = "Ajouter un aliment"}) => {
    const {apiService} = useServices();
    const [nutrients] = useFetch(() => apiService.getNutrients())
    const handleValidate = () => {
        onClose?.();
    }
    return (
            <Dialog open={open}>
                <div className={classes["container"]}>
                    <span className={classes["title"]}>{title}</span>
                    <Input required label="Nom de l'aliment" />
                    <Input label="Descripton" />
                    <div className={classes["macros-container"]}>
                        <Input required label="Protéines (g)" min={0} defaultValue={0} type="number"/>
                        <Input required label="Glucides (g)" min={0} defaultValue={0} type="number"/>
                        <Input required label="Lipides (g)" min={0} defaultValue={0} type="number"/>
                        <Input required label="Calories" min={0} defaultValue={0} type="number"/>
                    </div>
                    <div className={classes["nutrients-container"]}>
                        {nutrients?.map((nutrient) => (
                            <div key={nutrient.id}>
                                <Input defaultValue={0} min={0} type="number" label={nutrient.name}/>
                                <Select placeholder="Unité" options={[
                                    {label: "mcg", value: "mcg"},
                                    {label: "mg", value: "mg"},
                                    {label: "g", value: "g"},
                                ]}/>
                            </div>
                        ))}
                    </div>
                    <div className={classes["buttons-container"]}>
                        <Button onClick={onClose}>Fermer</Button>
                        <Button onClick={handleValidate}>Valider</Button>
                    </div>
                </div>
            </Dialog>
    );
};

type Props = {
   open?: boolean
    title?: string
   onClose?: () => void
}

export default FoodDialog;