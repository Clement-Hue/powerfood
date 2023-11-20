import React, {useState} from 'react';
import classes from "./FoodSearch.module.scss"
import {Button, Input} from "@shares";
import FoodList from "../FoodList";
import {UnidentifiedFood} from "@typing/app.type.ts";
import FoodDialog from "../FoodDialog";
import {useAppDispatch, useAppSelector, useThunks} from "@hooks";
import {foodSelectors, foodActions} from "@store/food";

const FoodSearch: React.FC<Props> = ( ) => {
    const [searchValue, setSearchValue] = useState("")
    const [open, setOpen] = useState(false)
    const foods = useAppSelector(foodSelectors.selectFoods)
    const selectedFood = useAppSelector(foodSelectors.selectSelectedFood)
    const {food: {foodDeleted, foodAdded}} = useThunks();
    const dispatch = useAppDispatch()
    const handleSelectFood = (foodId: string) => {
        dispatch(foodActions.foodSelected({foodId}))
    }
    const handleDeleteFood = async (foodId: string) => {
        dispatch(foodDeleted({foodId}))
    }

    const handleValidateFoodDialog = async (food: UnidentifiedFood) => {
        await dispatch(foodAdded({data: food}))
        setOpen(false)
    }

    return (
        <div className={classes.container}>
            <Input placeholder="Rechercher dans la liste" value={searchValue}
                   onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
            <Button onClick={() => setOpen(true)}>Ajouter un aliment à la liste</Button>
            <FoodList foods={foods && Object.values(foods).filter((f) => f.name.match(new RegExp(searchValue, "i")))}
                      onDeleteFood={handleDeleteFood} selected={selectedFood} onSelect={handleSelectFood} />
            <FoodDialog open={open} onValidate={handleValidateFoodDialog} onClose={() => setOpen(false)}/>
        </div>
    );
};

type Props = {}
export default FoodSearch;