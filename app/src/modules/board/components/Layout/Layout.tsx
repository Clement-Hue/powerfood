import classes from "./Layout.module.scss"
import Day from "../Day";
import FoodSearch from "../FoodSearch";
import {FoodsProvider} from "@providers";
import {useAppDispatch, useFetch, useServices} from "@hooks";
import {useEffect} from "react";
import {fetchFood} from "@store/food.ts";

const Layout = () => {
    const {apiService} = useServices();
    const [days ] = useFetch(() => apiService.getDays())
    const dispatch = useAppDispatch()

    useEffect(() => {
       dispatch(fetchFood())
    }, []);

    return (
        <FoodsProvider>
                <div className={classes.container}>
                    <FoodSearch />
                    <div className={classes["days-container"]}>
                        {days?.map(({name: dayName} ) => (
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
