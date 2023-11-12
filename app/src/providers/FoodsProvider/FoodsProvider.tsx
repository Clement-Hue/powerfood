import React, {createContext, useState} from 'react';
import {FoodDictionary} from "@typing/app.type.ts";
import {useFetch, useServices} from "@hooks";

export const Context = createContext<FoodsContext | null >(null  );
const FoodsProvider: React.FC<Props> = ({children}) => {
    const {apiService} = useServices()
    const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
    const [foods, setFoods] = useFetch<FoodDictionary>(() => apiService.getFoods())
    return (
        <Context.Provider value={{
            foods, setFoods, selectedFoodId, setSelectedFoodId
        }} >
            {children}
        </Context.Provider>
    );
};

type FoodsContext = {
    foods?: FoodDictionary
    setFoods: React.Dispatch<React.SetStateAction<FoodDictionary | undefined>>
    selectedFoodId: string | null
    setSelectedFoodId: React.Dispatch<React.SetStateAction<string | null>>
}

type Props = {
    children?: React.ReactNode
}
export default FoodsProvider;