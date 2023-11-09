import React, {useState} from 'react';
import classes from "./FoodSearch.module.scss"
import {Button, Input} from "@shares";
import FoodList from "../FoodList";
import {Food} from "@typing/app.type.ts";
import FoodDialog from "../FoodDialog";

const FoodSearch: React.FC<Props> = ({selectedFood, onSelect}) => {
    const [searchValue, setSearchValue] = useState("")
    const [open, setOpen] = useState(false)
    return (
        <div className={classes.container}>
            <Input placeholder="Rechercher dans la liste" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
            <Button onClick={() => setOpen(true)}>Ajouter un aliment à la liste</Button>
            <FoodList selected={selectedFood} onSelect={onSelect} />
            {open && <FoodDialog open onClose={() => setOpen(false)}/>}
        </div>
    );
};

type Props = {
   selectedFood?: Food | null
    onSelect?: (food: Food) => void
}
export default FoodSearch;