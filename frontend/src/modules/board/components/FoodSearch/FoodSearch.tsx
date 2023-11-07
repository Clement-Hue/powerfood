import React, {useState} from 'react';
import classes from "./FoodSearch.module.scss"
import {Button, Dialog, Input, Select} from "@shares";
import FoodList from "../FoodList";
import {Food} from "@typing/app.type.ts";
import {useServices, useFetch} from "@hooks";

const FoodSearch: React.FC<Props> = ({selectedFood, onSelect}) => {
    const [searchValue, setSearchValue] = useState("")
    const [open, setOpen] = useState(false)
    const {apiService} = useServices();
    const nutrients = useFetch(() => apiService.getNutrients())
    return (
        <div className={classes.container}>
            <Input placeholder="Rechercher dans la liste" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
            <Button onClick={() => setOpen(true)}>Ajouter un aliment à la liste</Button>
            <FoodList selected={selectedFood} onSelect={onSelect} />
            <Dialog open={open}>
                <div className={classes["dialog-container"]}>
                    <span className={classes["dialog__title"]}>Ajouter un aliment</span>
                    <div>
                        <Input label="name" />
                    </div>
                    <div className={classes["dialog__nutrients-container"]}>
                        {nutrients?.map((nutrient) => (
                            <div key={nutrient.id}>
                                <Input min={0} type="number" label={nutrient.name}/>
                                <Select label="Unité" options={[
                                    {label: "mcg", value: "mcg"},
                                    {label: "mg", value: "mg"},
                                    {label: "g", value: "g"},
                                ]}/>
                            </div>
                        ))}
                    </div>
                    <div className={classes["dialog__buttons-container"]}>
                        <Button onClick={() => setOpen(false)}>Fermer</Button>
                        <Button>Ajouter</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

type Props = {
   selectedFood?: Food
    onSelect?: (food: Food) => void
}
export default FoodSearch;