import {useState} from 'react';
import classes from "./Layout.module.scss"
import Day from "../Day";
import FoodSearch from "../FoodSearch";
import {FoodsProvider} from "@providers";

const Layout = () => {
    const [days ] = useState<string[]>( ["Jour par défaut"] )


    return (
        <FoodsProvider>
            <div className={classes.container}>
                <FoodSearch />
                <div className={classes["days-container"]}>
                    {days.map((dayName ) => (
                        <Day
                            key={dayName}
                            name={dayName}
                        />
                    ))}
                </div>
            </div>
        </FoodsProvider>
    );
};

export default Layout;
