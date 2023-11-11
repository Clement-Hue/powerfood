import classes from "./Layout.module.scss"
import Day from "../Day";
import FoodSearch from "../FoodSearch";
import {FoodsProvider} from "@providers";
import {useFetch, useServices} from "@hooks";

const Layout = () => {
    const {apiService} = useServices();
    const [days ] = useFetch(() => apiService.getDays())


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
