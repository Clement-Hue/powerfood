import classes from "./Layout.module.scss"
import Day from "../Day";
import FoodSearch from "../FoodSearch";
import {useAppDispatch, useAppSelector, useThunks} from "@hooks";
import {useEffect} from "react";
import {daySelectors} from "@store/day";

const Layout = () => {
    const dayNames = useAppSelector(daySelectors.selectDaysName)
    const {day: {daysFetched}, food: {foodsFetched}, nutrient: {nutrientFetched}} = useThunks();
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(nutrientFetched());
        dispatch(daysFetched());
        dispatch(foodsFetched());
    }, []);

    return (
            <div className={classes.container}>
                <FoodSearch />
                <div className={classes["days-container"]}>
                    {dayNames?.map((dayName) => (
                        <Day
                            key={dayName}
                            name={dayName}
                        />
                    ))}
                </div>
            </div>
    );
};

export default Layout;
