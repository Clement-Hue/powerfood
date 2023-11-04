import React, {useRef, useState} from 'react';
import {Input} from "@shares"
import classes from "./Layout.module.scss"
import Day from "../Day";
import Meal from "../Meal";
import {apiService} from "@services";
import FoodList from "../FoodList";
import {SearchResultFood} from "@types/api.type.ts";

const Layout = () => {
    const [foods, setFoods] = useState<SearchResultFood[]>();
    let debounce = useRef<number>();
    const meals = [
        {day: "Jour par défaut", meals: [
            <Meal key="déjeuner" name="déjeuner" foods={["poulet 100g", "riz 200g"]} />,
            <Meal key="diner" name="diner" foods={["jambon 100g", "pate 200g"]} />,
            ]},
    ]

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (debounce.current) {
            clearTimeout(debounce.current!)
        }
        debounce.current = setTimeout(async () => {
            const res = await apiService.searchFood(e.target.value)
            setFoods(res.foods);
        }, 500)
    }
    return (
        <div className={classes.container}>
            <div>
                <Input onChange={handleSearch} label="Rechercher un aliment"/>
                <FoodList foods={foods} />
            </div>
            <div className={classes["days-container"]}>
                {meals.map(({day, meals}) => (
                    <Day key={day} name={day}>
                        {meals}
                    </Day>
                ))}
            </div>
        </div>
    );
};

export default Layout;