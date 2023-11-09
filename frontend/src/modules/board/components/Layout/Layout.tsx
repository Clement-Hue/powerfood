import {useState} from 'react';
import classes from "./Layout.module.scss"
import Day from "../Day";
import type {Food} from "@typing/app.type.ts";
import FoodSearch from "../FoodSearch";
import {FoodsProvider} from "@providers";

const Layout = () => {
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [days ] = useState<string[]>( ["Jour par défaut"] )

    const handleSelectFood = (food: Food | null) => {
        if (selectedFood?.id === food?.id) {
            setSelectedFood(null)
        } else {
            setSelectedFood(food);
        }
    }

    return (
        <FoodsProvider>
            <div className={classes.container}>
                <FoodSearch selectedFood={selectedFood} onSelect={handleSelectFood}/>
                <div className={classes["days-container"]}>
                    {days.map((dayName ) => (
                        <Day
                            key={dayName}
                            name={dayName}
                            selectedFood={selectedFood}
                        />
                    ))}
                </div>
            </div>
        </FoodsProvider>
    );
};

export default Layout;
