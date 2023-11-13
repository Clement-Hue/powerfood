import React, {useState, useCallback} from 'react';
import {Autocomplete} from "@shares";
import {useDebounce, useServices} from "@hooks";
import classes from "./SearchFood.module.scss"
import {getFoodUnitText} from "@utils";
import {ValuesFor} from "@typing/app.type.ts";

const SearchFood: React.FC<Props> = ({valuesFor = "100g"}) => {
    const [search, setSearch] = useState<Option | null>();
    const [searchInput, setSearchInput] = useState<string>("");
    const [options, setOptions] = useState<Option[]>([])
    const {foodApiService} = useServices()

    const apiCall = useCallback(async () => {
        if (searchInput) {
            const res = await foodApiService.searchFood(searchInput)
            setOptions(res.common.map((food) => ({
                value: food.food_name, label: (
                    <div className={classes["option-container"]}>
                        <img className={classes["option-img"]} src={food.photo.thumb} />
                        <div>
                            {food.food_name}
                            <div className="small-typo">{getFoodUnitText(valuesFor)}</div>
                        </div>
                    </div>
                )
            })))
        }
    }, [searchInput, foodApiService, valuesFor])

    useDebounce(apiCall)
    const handleSearchChange = (value: Option | null) => {
        setSearch(null);
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
}
export default SearchFood;