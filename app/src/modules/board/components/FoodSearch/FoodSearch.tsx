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
    const {foods, setFoods, setSelectedFoodId, selectedFoodId} = useFoods()
    const handleSelectFood = (foodId: string | null) => {
        if (selectedFoodId === foodId) {
            setSelectedFoodId(null)
        } else {
            setSelectedFoodId(foodId);
        }
    }
    const handleDeleteFood = async (foodId: string) => {
        await apiService.deleteFood(foodId);
        setFoods((prev = {}) =>  {
            const {[foodId]: _ ,...foods} = prev;
            return foods
        })
        handleSelectFood(null)
    }

    const handleValidateFoodDialog = async (food: UnidentifiedFood) => {
        const id = await apiService.addFood(food);
        setFoods((prev = {}) => ({
            ...prev, [id]: {...food, id}
        }))
        setOpen(false)
    }

    return (
        <div className={classes.container}>
            <Input placeholder="Rechercher dans la liste" value={searchValue}
                   onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
            <Button onClick={() => setOpen(true)}>Ajouter un aliment à la liste</Button>
            <FoodList foods={foods && Object.values(foods).filter((f) => f.name.match(new RegExp(searchValue, "i")))}
                      onDeleteFood={handleDeleteFood} selected={selectedFoodId} onSelect={handleSelectFood} />
            <FoodDialog open={open} onValidate={handleValidateFoodDialog} onClose={() => setOpen(false)}/>
        </div>
    );
};

type Props = {}
export default FoodSearch;