import React from 'react';
import {Button, Dialog} from "@shares";
import {UnidentifiedFood} from "@typing/app.type.ts";
import {FoodFormValues} from "./components/FoodForm";
import {FoodForm} from "./components";
import {useAppSelector} from "@hooks";
import {nutrientSelectors} from "@store/nutrient";

const FoodDialog: React.FC<Props> = ({open,onValidate, onClose,
                                         title = "Ajouter un aliment", initValues} ) => {
    const nutrients = useAppSelector(nutrientSelectors.selectNutrient)

    const handleValidate = async (data: FoodFormValues) => {
        onValidate?.({
            name: data["name"],
            description: data["description"],
            valuesFor: data["valuesFor"],
            proteins: Number(data["proteins"]),
            lipids: Number(data["lipids"]),
            carbs: Number(data["carbs"]),
            calories: Number(data["calories"]),
            nutrients: nutrients?.map((nutrient) => ({
                id: nutrient.id,
                name: nutrient.name,
                amount: Number(data[`value-${nutrient.id}`]),
                unit: data[`unit-${nutrient.id}`]
                })) ?? []
        })
    }

    return (
            <Dialog onClose={onClose} open={open} header={ <span className="title2-typo">{title}</span> }
                    actions={
                        <>
                            <Button onClick={() => onClose?.()}>Fermer</Button>
                            <Button form="add-food-form" type="submit"> Valider</Button>
                        </>
                    }
            >
                {nutrients && <FoodForm initValues={initValues} formId="add-food-form"
                                        nutrients={nutrients} onValidate={handleValidate}/>}
            </Dialog>
    );
};


type Props = {
   open?: boolean
   title?: string
   onClose?: () => void
   onValidate?: (food: UnidentifiedFood) => void
   initValues?: UnidentifiedFood | null
}

export default FoodDialog;