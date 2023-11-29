import classes from "./Summary.module.scss"
import { useAppSelector } from '@hooks';
import { daySelectors } from '@store/day';
import {Macro, Micro} from './components';

const Summary: React.FC<Props> = ({dayName}) => {
    const macros = useAppSelector((state) => daySelectors.selectMacros(state, dayName))
    const micros = useAppSelector((state) => daySelectors.selectMicros(state, dayName))

    return (
        <div role="region" aria-label="Résultat" className={classes.container}>
            <ul className={classes["macros-container"]}>
                {macros?.map((macro) => <Macro key={macro.id} macroInfo={macro} dayName={dayName} />)}
            </ul>
            <ul className={classes["micros-container"]}>
                {micros?.map((micro) => <Micro key={micro.id} microInfo={micro} />)}
            </ul>
        </div>
    );
};


type Props = {
    dayName: string
}

export default Summary;
