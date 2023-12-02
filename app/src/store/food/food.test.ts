import { FoodsState, NutrientsState } from "@typing/store.type"
import { foodSelectors } from "."
import { RootState } from ".."

const foods: FoodsState = {
    "poulet_id": {
        "id": "poulet_id",
        "name": "Poulet",
        "valuesFor": "100g",
        "proteins": 20,
        "lipids": 0.39,
        "carbs": 1,
        "calories": 87.51,
        nutrients: [
            {
                "id": "vit_b1",
                "unit": "g",
                "amount": 0.002
            },
            {
                "id": "vit_a",
                "unit": "mcg",
                "amount": 200
            },
            {
                "id": "vit_b12",
                "unit": "mg",
                "amount": 0.0009 
            }

        ]
    }
}

const nutrients: NutrientsState[] = [
    {
        id: "vit_b1",
        name: "Vitamine B1" ,
        DRI: {
            amount: 500,
            unit: "mg"
        }
    },
    {
        id: "vit_a",
        name: "Vitamine A" ,
        DRI: {
            amount: 800,
            unit: "mcg"
        }
    },
    {
        id: "vit_b12",
        name: "Vitamine B12" ,
        DRI: {
            amount: 2.4,
            unit: "mcg"
        }
    }
]

const defaultState: RootState = {food: {foods, selectedFoodId: null}, nutrient: {nutrients}, day: {days: {}}}

describe("Food selectors", () => {
    test("should get food with nutrients and percentage of DRI", () => {
        expect(foodSelectors.selectFoods(defaultState)).toEqual({
            "poulet_id": {...foods["poulet_id"], nutrients: [
                {
                    "id": "vit_b1",
                    "name": "Vitamine B1" ,
                    "unit": "g",
                    "amount": 0.002,
                    "percentage": 0.4 
                },
                {
                    "id": "vit_a",
                    "name": "Vitamine A" ,
                    "unit": "mcg",
                    "amount": 200,
                    "percentage": 25
                },
                {
                    "id": "vit_b12",
                    "name": "Vitamine B12" ,
                    "unit": "mg",
                    "amount": 0.0009,
                    "percentage": 37.5
                }
            ]}
        })
    })
})
