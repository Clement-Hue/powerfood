import React from 'react';
import {SearchResultFood} from "@types/api.type.ts";
import classes from "./FoodList.module.scss"
import {Button} from "@shares";

const FoodList: React.FC<Props> = ({foods, selected, onSelect,
                                   currentPage, totalPage, onPreviousPage, onPageChange}) => {
    return !foods?.length ? null : (
        <div className={classes.container}>
            {foods?.map((food) => (
                <div onClick={() => onSelect?.(food)} data-selected={selected?.fdcId === food.fdcId} key={food.fdcId} className={classes["item-container"]}>
                    <span>{food.description}</span>
                </div>
            ))}
            <div className={classes["page-container"]}>
                <Button onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage <= 1}>Précédent</Button>
                <span>{currentPage}</span>
                <Button onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage >= totalPage}>Suivant</Button>
                <span className={classes["page__total"]}>Total {totalPage}</span>
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