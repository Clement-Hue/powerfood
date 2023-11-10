import React, {createContext} from 'react';
import {Nutrient} from "@typing/app.type.ts";
import {useFetch, useServices} from "@hooks";

export const Context = createContext<NutrientsContext | null >(null  );
const NutrientsProvider: React.FC<Props> = ({children}) => {
    const {apiService} = useServices()
    const [nutrients,setNutrients ] = useFetch<Nutrient[]>(() => apiService.getNutrients())
    return (
        <Context.Provider value={{
            nutrients, setNutrients
    }} >
    {children}
    </Context.Provider>
);
};

type NutrientsContext = {
    nutrients?: Nutrient[]
    setNutrients: React.Dispatch<React.SetStateAction<Nutrient[] | undefined>>
}

type Props = {
    children?: React.ReactNode
}
export default NutrientsProvider;
