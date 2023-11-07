import {useState} from 'react';
import classes from "./Layout.module.scss"
import Day from "../Day";
import type {Food} from "@typing/app.type.ts";
import FoodSearch from "../FoodSearch";

const Layout = () => {
    const [selectedFood, setSelectedFood] = useState<Food>();
    const [days ] = useState<string[]>( ["Jour par défaut"] )


    return (
        <div className={classes.container}>
            <FoodSearch selectedFood={selectedFood} onSelect={setSelectedFood}/>
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
    );
};

export default Layout;
