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
    let debounce = useRef<number>();
    const meals = [
        {day: "Jour par défaut", meals: [
            <Meal key="déjeuner" name="déjeuner" foods={["poulet 100g", "riz 200g"]} />,
            <Meal key="diner" name="diner" foods={["jambon 100g", "pate 200g"]} />,
            ]},
    ]

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
        console.log(res)
    }

    return (
        <div className={classes.container}>
            <div>
                <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label="Rechercher un aliment"/>
                <FoodList onPageChange={(p) => searchApiCall(p)} totalPage={searchResult?.totalPages} currentPage={searchResult?.currentPage}
                          selected={selectedFood} onSelect={setSelectedFood} foods={searchResult?.foods} />
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