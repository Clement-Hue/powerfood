import React, {useEffect, useRef, useState} from 'react';
import {Input} from "@shares"
import classes from "./Layout.module.scss"
import Day from "../Day";
import Meal from "../Meal";
import {apiService} from "@services";
import FoodList from "../FoodList";
import {SearchResult, SearchResultFood} from "@types/api.type.ts";

const Layout = () => {
    const [searchResult, setSearchResult] = useState<SearchResult>();
    const [selectedFood, setSelectedFood] = useState<SearchResultFood>();
    const [searchValue, setSearchValue] = useState("");
    const [days, setDays] = useState<DayType>({
        ["Jour par défaut"]: []
    })
    let debounce = useRef<number>();

    useEffect(() => {
        (async function () {
            if (debounce.current) {
                clearTimeout(debounce.current!);
            }
            if (!searchValue) {
                setSearchResult(undefined)
                return;
            }
            debounce.current = setTimeout(async () => {
                await searchApiCall();
            }, 500)
        })()
    }, [searchValue])

    useEffect(() => {
       setSelectedFood(undefined);
    }, [searchResult]);

    const searchApiCall = async (pageNumber = 1) => {
        const res = await apiService.searchFood(searchValue, {pageNumber});
        setSearchResult(res);
    }

    const handleAddMeal = (dayName: string, mealName: string) => {
        setDays((o) => ({
            ...o, [dayName]: [...o[dayName], {mealName}]
        }))
    }

    const handleDeleteMeal = (dayName: string, mealName: string) => {
        setDays((o) => (
            {...o, [dayName]: o[dayName].filter((m) => m.mealName !== mealName)}
        ))
    }

    return (
        <div className={classes.container}>
            <div>
                <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
                <FoodList onPageChange={(p) => searchApiCall(p)} totalPage={searchResult?.totalPages} currentPage={searchResult?.currentPage}
                          selected={selectedFood} onSelect={setSelectedFood} foods={searchResult?.foods} />
            </div>
            <div className={classes["days-container"]}>
                {Object.entries(days).map(([dayName, meals]) => (
                    <Day onAddMeal={(mealName) => handleAddMeal(dayName, mealName)}
                         key={dayName} name={dayName}>
                        {meals.map((meal) => (
                            <Meal
                                onDelete={() => handleDeleteMeal(dayName, meal.mealName)}
                                key={meal.mealName} name={meal.mealName} foods={meal.foods}/>
                        ))}
                    </Day>
                ))}
            </div>
        </div>
    );
};

type DayType = {
    [key: string]: {mealName: string, foods?: string[]}[]
}

export default Layout;