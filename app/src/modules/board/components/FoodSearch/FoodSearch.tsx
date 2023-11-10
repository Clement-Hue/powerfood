import React, {useState} from 'react';
import classes from "./FoodSearch.module.scss"
import {Button, Input} from "@shares";
import FoodList from "../FoodList";
import {UnidentifiedFood} from "@typing/app.type.ts";
import FoodDialog from "../FoodDialog";
import {useFoods, useServices} from "@hooks";

const FoodSearch: React.FC<Props> = ( ) => {
    const [searchValue, setSearchValue] = useState("")
    const [open, setOpen] = useState(false)
    const {apiService} = useServices();
    const {foods, setFoods, setSelectedFood, selectedFood} = useFoods()

    const handleSelectFood = (foodId: string | null) => {
        if (selectedFood === foodId) {
            setSelectedFood(null)
        } else {
            setSelectedFood(foodId);
        }
    }
    const handleDeleteFood = async (foodId: string) => {
        await apiService.deleteFood(foodId);
        setFoods((prev) =>  (
            prev?.filter((f) => f.id !== foodId)
        ))
        handleSelectFood(null)
    }

    const handleValidateFoodDialog = async (food: UnidentifiedFood) => {
        const id = await apiService.addFood(food);
        setFoods((prev) => ([
            ...(prev ?? []), {...food, id}
        ]))
        setOpen(false)
    }

    return (
        <div className={classes.container}>
            <Input placeholder="Rechercher dans la liste" value={searchValue}
                   onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
            <Button onClick={() => setOpen(true)}>Ajouter un aliment à la liste</Button>
            <FoodList foods={foods?.filter((f) => f.name.match(new RegExp(searchValue, "i")))}
                      onDeleteFood={handleDeleteFood} selected={selectedFood} onSelect={handleSelectFood} />
            <FoodDialog open={open} onValidate={handleValidateFoodDialog} onClose={() => setOpen(false)}/>
        </div>
    );
};

type Props = {}
export default FoodSearch;