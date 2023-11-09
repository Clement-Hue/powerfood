import React, {useState} from 'react';
import classes from "./FoodSearch.module.scss"
import {Button, Input} from "@shares";
import FoodList from "../FoodList";
import {Food} from "@typing/app.type.ts";
import FoodDialog from "../FoodDialog";
import {useFetch, useServices} from "@hooks";

const FoodSearch: React.FC<Props> = ({selectedFood, onSelect}) => {
    const [searchValue, setSearchValue] = useState("")
    const [open, setOpen] = useState(false)
    const {apiService} = useServices();
    const [foods, setFoods] = useFetch(() => apiService.getFoods())
    const handleDeleteFood = async (foodId: string) => {
        await apiService.deleteFood(foodId);
        setFoods((prev) =>  (
            prev?.filter((f) => f.id !== foodId)
        ))
        onSelect?.(null)
    }

    const handleCloseFoodDialog = (food?: Food) => {
        if (food) {
            setFoods((prev) => ([
                ...(prev ?? []), food
            ]))
        }
        setOpen(false);
    }

    return (
        <div className={classes.container}>
            <Input placeholder="Rechercher dans la liste" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
            <Button onClick={() => setOpen(true)}>Ajouter un aliment à la liste</Button>
            <FoodList foods={foods?.filter((f) => f.name.match(new RegExp(searchValue, "i")))} onDeleteFood={handleDeleteFood} selected={selectedFood} onSelect={onSelect} />
            {open && <FoodDialog open onClose={handleCloseFoodDialog}/>}
        </div>
    );
};

type Props = {
   selectedFood?: Food | null
   onSelect?: (food: Food | null) => void
}
export default FoodSearch;