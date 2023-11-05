import React, {useState} from 'react';
import {SearchResultFood} from "@typing/api.type.ts";
import classes from "./FoodList.module.scss"
import {Button} from "@shares";
import NutrientsInfo from "../NutrientsInfo/NutrientsInfo.tsx";

const FoodList: React.FC<Props> = ({foods, selected, onSelect,
                                   currentPage, totalPage, onPreviousPage, onPageChange}) => {
    const [showNutrients, setShowNutrients] = useState<number | null>(null);
    return !foods?.length ? null : (
        <div className={classes.container}>
            {foods?.map((food) => (
                <div onClick={() => onSelect?.(food)} data-selected={selected?.fdcId === food.fdcId} key={food.fdcId}
                     onMouseEnter={() => setShowNutrients(food.fdcId)}
                     onMouseLeave={() => setShowNutrients(null)}
                     className={classes["item-container"]}>
                    <span>{food.description}</span>
                    {!!food.brandName && <span>{food.brandName}</span>}
                    {showNutrients === food.fdcId &&  <NutrientsInfo nutrients={food.foodNutrients} />}
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
    foods?: SearchResultFood[]
    selected?: SearchResultFood
    onSelect?: (food: SearchResultFood) => void
    currentPage?: number
    totalPage?: number
    onPageChange?: (page: number) => void
}

export default FoodList;