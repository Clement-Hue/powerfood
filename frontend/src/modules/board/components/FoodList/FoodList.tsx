import React, {useState} from 'react';
import classes from "./FoodList.module.scss"
import {Button} from "@shares";
import NutrientsInfo from "../NutrientsInfo/NutrientsInfo.tsx";
import {Food} from "@typing/app.type.ts";

const FoodList: React.FC<Props> = ({foods, selected, onSelect,
                                   currentPage, totalPage, onPreviousPage, onPageChange}) => {
    const [showNutrients, setShowNutrients] = useState<number | null>(null);
    return !foods?.length ? null : (
        <div className={classes.container}>
            {foods?.map((food) => (
                <div onClick={() => onSelect?.(food)} data-selected={selected?.id === food.id} key={food.id}
                     onMouseEnter={() => setShowNutrients(food.id)}
                     onMouseLeave={() => setShowNutrients(null)}
                     className={classes["item-container"]}>
                    <span>{food.description}</span>
                    {showNutrients === food.id &&  <NutrientsInfo nutrients={food.nutrients} />}
                </div>
            ))}
            <div className={classes["page-container"]}>
                <Button onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage <= 1}>Précédent</Button>
                <span>{currentPage}</span>
                <Button onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage >= totalPage}>Suivant</Button>
                <span className={classes["page__total"]}>Total page {totalPage}</span>
            </div>
        </div>
    );
};

type Props = {
    foods?: Food[]
    selected?: Food
    onSelect?: (food: Food) => void
    currentPage?: number
    totalPage?: number
    onPageChange?: (page: number) => void
}

export default FoodList;