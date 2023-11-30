import React, {useState, useCallback} from 'react';
import {Autocomplete} from "@shares";
import {useDebounce, useServices} from "@hooks";
import classes from "./SearchFood.module.scss"
import {getCalories, getFoodUnitText, apiNutrientMapping} from "@utils";
import {ValuesFor} from "@typing/unit.type.ts";
import {FoodFormValues} from "../FoodForm";

const SearchFood: React.FC<Props> = ({valuesFor = "100g", onSearch}) => {
    const [search, setSearch] = useState<Option | null>();
    const [searchInput, setSearchInput] = useState<string>("");
    const [options, setOptions] = useState<Option[]>([])
    const {foodApiService} = useServices()

    const apiCall = useCallback(async () => {
        if (!searchInput) {
            return;
        }
        const res = await foodApiService.searchFood(searchInput)
        setOptions(res.common.map((food) => ({
            value: food.food_name, label: (
                <div className={classes["option-container"]}>
                    <img className={classes["option-img"]} src={food.photo?.thumb} />
                    <div>
                        {food.food_name}
                        <div className="small-typo">{getFoodUnitText(valuesFor)}</div>
                    </div>
                </div>
            )
        })))
    }, [searchInput, foodApiService, valuesFor])

    useDebounce(apiCall)
    const handleSearchChange = async (option: Option | null) => {
        if (!option) {
            return
        }
        setSearch(null);
        const res = await foodApiService.getFoodInfo(option.value, valuesFor)
        const food = res.foods?.[0];
        if (food) {
            onSearch?.({
                name: food.food_name,
                valuesFor,
                lipids: String(food.nf_total_fat),
                carbs: String(food.nf_total_carbohydrate),
                proteins: String(food.nf_protein),
                calories: String(getCalories(food.nf_protein, food.nf_total_carbohydrate, food.nf_total_fat)),
                ...food.full_nutrients.reduce((prev, nut) => {
                   const nutInfo = apiNutrientMapping(nut.attr_id)
                    if (!nutInfo) {
                        return prev;
                    }
                    return {...prev,
                        [`value-${nutInfo.id}`]: String(nut.value),
                        [`unit-${nutInfo.id}`]: nutInfo.unit,
                    }
                }, {})
            })
        }
    }

    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
        if (!value) {
            setOptions([])
        }
    }
    return (
        <Autocomplete
            placeholder="Rechercher..."
            inputValue={searchInput} onInputChange={handleSearchInputChange} options={options} value={search}
            onChange={handleSearchChange} helpText="Gagner du temps en pré-remplissant les champs avec des aliments depuis internet"
            label="Rechercher un aliment sur internet" noOptionsMessage={() => "Pas d'aliment(s)"} />
    );
};

type Option = {value: string, label: React.ReactNode}

type Props = {
    valuesFor?: ValuesFor
    onSearch?: (formValues: Omit<FoodFormValues, "description">) => void
}
export default SearchFood;
