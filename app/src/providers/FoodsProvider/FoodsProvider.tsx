import React, {createContext, useState} from 'react';
import {Food} from "@typing/app.type.ts";
import {useFetch, useServices} from "@hooks";

export const Context = createContext<FoodsContext | null >(null  );
const FoodsProvider: React.FC<Props> = ({children}) => {
    const {apiService} = useServices()
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [foods, setFoods] = useFetch<Food[]>(() => apiService.getFoods())
    return (
        <Context.Provider value={{
            foods, setFoods, selectedFood, setSelectedFood
        }} >
            {children}
        </Context.Provider>
    );
};

type FoodsContext = {
    foods?: Food[]
    setFoods: React.Dispatch<React.SetStateAction<Food[] | undefined>>
    selectedFood: Food | null
    setSelectedFood: React.Dispatch<React.SetStateAction<Food | null>>
}

type Props = {
    children?: React.ReactNode
}
export default FoodsProvider;