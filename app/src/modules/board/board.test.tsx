import {render, screen, fireEvent, waitFor, within} from "@testing";
import {Board} from "../index.ts";
import {ServicesProvider} from "@providers";
import {UnidentifiedFood, NutrientInfo, FoodsDictionary} from "@typing/app.type.ts";
import {ServicesOverride} from "@providers/ServicesProvider/ServicesProvider.tsx";
import {v4 as uuid} from "uuid"
import { MealState } from "@typing/store.type.ts";

const TestComponent = ({api = {}}: {api?: ServicesOverride["apiService"]}) => {
    return (
        <ServicesProvider overrides={{
            graphService: {
                BarChart: jest.fn(() => ({
                    create: jest.fn(),
                    remove: jest.fn()
                }))
            },
            apiService: {
                async getDays() {
                    return {["Jour par défaut"]: []};
                },
                async getFoods(): Promise<FoodsDictionary> {
                    return {
                       "1": {
                            "id": "1",
                            "name": "Poulet",
                            "valuesFor": "100g",
                            "proteins": 20,
                            "lipids": 0.39,
                            "carbs": 1,
                            "calories": 150,
                            nutrients: [
                                {
                                    "id": "vit_c",
                                    "name": "Vitamine C",
                                    "unit": "g",
                                    "amount": 0.002
                                }
                            ]
                        },
                        "2": {
                            "id": "2",
                            "name": "Banane",
                            "valuesFor": "100g",
                            "proteins": 1.28,
                            "lipids": 0.39,
                            "carbs": 29.6,
                            "calories": 122,
                            "nutrients": [
                                {
                                    "id": "vit_c",
                                    "name": "Vitamine C",
                                    "unit": "mg",
                                    "amount": 8.7
                                },
                                {
                                    "id": "min_pot",
                                    "name": "Potassium",
                                    "unit": "mg",
                                    "amount": 358
                                }
                            ]
                        }
                    }
                },
                async getNutrients(): Promise<NutrientInfo[]> {
                    return [{
                       id: "vit_c",
                       name: "Vitamine C" ,
                        DRI: {
                           amount: 500,
                            unit: "mg"
                        }
                    },
                    {
                        id: "min_pot",
                        name: "Potassium" ,
                        DRI: {
                            amount: 1500,
                            unit: "mg"
                        }
                    }]
                },
                addMeal: async () => uuid(),
                deleteMeal: async () => {},
                addFoodToMeal: async () => {},
                deleteFoodFromMeal: async () => {},
                deleteFood: async () => {},
                updateFood: async () => {},
                updateFoodMeal: async () => {},
                addFood: async () => uuid(),
                ...api
            }
        }}>
            <Board/>
        </ServicesProvider>
    )
}
describe("Analyse", () => {
    it("should show day nutrients summary", async () => {
        render( <TestComponent/>)
        await waitFor(() => {
            expect(screen.getByText(/jour par défaut/i)).toBeInTheDocument();
            const region = screen.getByRole("region", {name: "Résultat"});
            expect(within(region).getByRole("listitem", {name: "Vitamine C"})).toBeInTheDocument()
            expect(within(region).getByText("DRI: 500 mg")).toBeInTheDocument()
        })
    })

    it("should add and remove meal", async () => {
        const mealId = "10";
        const addMeal = jest.fn(() => mealId)
        const deleteMeal = jest.fn()
        render( <TestComponent api={{addMeal, deleteMeal}}/>)
        fireEvent.change(await screen.findByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        await waitFor(() => {
            expect(addMeal).toHaveBeenCalledWith("Jour par défaut", "déjeuner");
            expect(screen.getByRole("region", {name: "déjeuner"})).toBeInTheDocument();
        })
        fireEvent.click(screen.getByRole("button", {name: /supprimer déjeuner/i}));
        await waitFor(() => {
            expect(deleteMeal).toHaveBeenCalledWith(mealId);
            expect(screen.queryByRole("region", {name: "déjeuner"})).not.toBeInTheDocument();
        })
    })

    it("should disable add meal button if the meal already exist or input in empty", async () => {
        render( <TestComponent/>)
        await waitFor(() => {
            expect(screen.getByRole("button", {name: "Ajouter un repas"})).toBeDisabled();
        })
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        await waitFor(() => {
            expect(screen.getByRole("button", {name: "Ajouter un repas"})).toBeDisabled();
        })
    })

    it("should disable add food to meal button if no food selected and replace the food in the meal with new quantity", async () => {
        render( <TestComponent/>)
        fireEvent.change(await screen.findByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        await waitFor(() => {
            expect(screen.getByRole("button", {name: /ajouter l'aliment/i})).toBeDisabled();
        })
        fireEvent.click(screen.getByText(/banane/i))
        fireEvent.click(screen.getByRole("button", {name: /ajouter l'aliment/i}) )
        await waitFor(() => {
            expect(screen.getByText(/banane 100g/i)).toBeInTheDocument()
        })
        fireEvent.change(screen.getByPlaceholderText(/quantité/i), {target: {value: "80"}})
        fireEvent.click(screen.getByRole("button", {name: /mettre à jour/i}) )
        await waitFor(() => {
            expect(screen.getByText(/banane 80g/i)).toBeInTheDocument()
            expect(screen.queryByText(/banane 100g/i)).not.toBeInTheDocument()
        })
    })

    it("should disable add food to meal button if quantity is 0g", async () => {
        render( <TestComponent/>)
        const food = await screen.findByText(/banane/i)
        fireEvent.click(food);
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.change(await screen.findByPlaceholderText(/quantité/i), {target: {value: "0"}})
        await waitFor(() => {
            expect(screen.getByRole("button", {name: /ajouter l'aliment/i})).toBeDisabled();
        })
    })

    it("should empty meal name input once the meal is added", async () => {
        render( <TestComponent/>)
        fireEvent.change(await screen.findByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        await waitFor(() => {
            expect(screen.getByRole("textbox", {name: "Repas"})).toHaveValue("")
        })
    })



    it("should add selected food to meal and remove it", async () => {
        const mealId = "5";
        const addMeal = jest.fn(() => mealId);
        const addFoodToMeal = jest.fn();
        const deleteFoodFromMeal = jest.fn()
        render( <TestComponent api={{addFoodToMeal, deleteFoodFromMeal, addMeal}}/>)
        const food = await screen.findByText(/banane/i)
        fireEvent.click(food);
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.change(await screen.findByPlaceholderText(/quantité/i), {target: {value: "80"}})
        fireEvent.click(await screen.findByRole("button", {name: /ajouter l'aliment/i}));
        const meal = screen.getByRole("region", {name: "déjeuner"});
        await waitFor(() => {
            expect(addFoodToMeal).toHaveBeenCalledWith(mealId, "2", {amount: 80})
            expect(within(meal).getByText(/banane 80g/i)).toBeInTheDocument()
            expect(screen.getByText(/6.96 mg/i)).toBeInTheDocument()
        })
        expect(within(meal).getByText(/banane 80g/i)).toBeInTheDocument()
        fireEvent.click(within(meal).getByRole("button", {name: /supprimer banane/i}))
        await waitFor(() => {
            expect(deleteFoodFromMeal).toHaveBeenCalledWith(mealId, "2");
            expect(within(meal).queryByText(/banane 80g/i)).not.toBeInTheDocument()
        })
    })

    it("should create several meals and compute total nutrients and reset if meal is removed", async () => {
        render( <TestComponent/>)
        fireEvent.change(await screen.findByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "diner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.click( await screen.findByText(/banane/i) );
        const addFoodButtons = await screen.findAllByRole("button", {name: /ajouter l'aliment/i})
        fireEvent.click(addFoodButtons[0]);
        fireEvent.click(addFoodButtons[1]);
        fireEvent.click( await screen.findByText(/poulet/i) );
        fireEvent.click(addFoodButtons[0]);
        await waitFor(() => {
            expect(screen.getByText(/19.4 mg/i)).toBeInTheDocument() // Vitamine C
        })
        fireEvent.click(screen.getByRole("button", {name: /supprimer déjeuner/i}))
        await waitFor(() => {
            expect(screen.getByText(/8.7 mg/i)).toBeInTheDocument()
        })
    })

    it("should add food and update it", async () => {
        const updateFoodMeal = jest.fn()
        render( <TestComponent api={{updateFoodMeal}} />)
        const food = await screen.findByText(/banane/i)
        fireEvent.click(food);
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.change(await screen.findByPlaceholderText(/quantité/i), {target: {value: "80"}})
        fireEvent.click(await screen.findByRole("button", {name: /ajouter l'aliment/i}));
        const meal = screen.getByRole("region", {name: "déjeuner"});
        await waitFor(() => {
            expect(within(meal).getByText(/banane 80g/i)).toBeInTheDocument()
        })
        fireEvent.change(screen.getByPlaceholderText(/quantité/i), {target: {value: "50"}})
        fireEvent.click(screen.getByRole("button", {name: /mettre à jour/i}));
        await waitFor(() => {
            expect(within(meal).getByText(/banane 50g/i)).toBeInTheDocument()
            expect(updateFoodMeal).toHaveBeenCalled();
        })
    })

    it("should disable add food to meal button if the selected food is deleted", async () => {
        render( <TestComponent />)
        const food = await screen.findByText(/banane/i)
        fireEvent.click(food);
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.click(within(screen.getByRole("listitem", {name:/banane/i})).getByRole("button", {name: /supprimer/i}))
        await waitFor(() => {
            expect(screen.getByRole("button", {name: /ajouter l'aliment/i})).toBeDisabled()
        })
    })

    it("should delete food from meal if food is deleted", async () => {
        render( <TestComponent />)
        const food = await screen.findByText(/banane/i)
        fireEvent.click(food);
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.click(await screen.findByRole("button", {name: /ajouter l'aliment/i}))
        await waitFor(() => {
            expect(screen.getByText(/banane 100g/i)).toBeInTheDocument()
        })
        fireEvent.click(within(screen.getByRole("listitem", {name:/banane/i})).getByRole("button", {name: /supprimer/i}))
        await waitFor(() => {
            expect(screen.queryByText(/banane 100g/i)).not.toBeInTheDocument()
        })
    })

    it("should load all meals saved", async () => {
        const getDays = jest.fn(() => ({
               ["Jour par défaut"]: [
                       {name: "déjeuner", id: "1", foods: [{id: "1", amount: 100}, {id: "2", amount: 50}]},
                       {name: "diner", id: "2", foods: []}
                   ] as MealState[]
            }
        ));
        render( <TestComponent api={{getDays}}/>)
        await waitFor(() => {
            const meal = screen.getByRole("region", {name: "déjeuner"})
            expect(meal).toBeInTheDocument();
            expect(screen.getByRole("region", {name: "diner"})).toBeInTheDocument();
            expect(within(meal).getByText(/poulet 100g/i)).toBeInTheDocument();
            expect(within(meal).getByText(/banane 50g/i)).toBeInTheDocument();
            expect(within(screen.getByRole("region", {name: "diner"})).queryByText(/poulet 100g/i)).not.toBeInTheDocument()
        })
    })

    it("should show macros nutrients", async () => {
        render( <TestComponent />)
        const list = await screen.findByRole("list", {name: /liste des aliments/i});
        fireEvent.click( await within(list).findByText(/banane/i))
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.click(await screen.findByRole("button", {name: /ajouter l'aliment/i}))
        fireEvent.click(within(list).getByText(/poulet/i))
        fireEvent.change(screen.getByPlaceholderText(/quantité/i), {target: {value: "50"}})
        fireEvent.click(screen.getByRole("button", {name: /ajouter l'aliment/i}))
        await waitFor(() => {
            expect(screen.getByText(/protéines 11.28 g/i)).toBeInTheDocument();
            expect(screen.getByText(/lipides 0.59 g/i)).toBeInTheDocument();
            expect(screen.getByText(/glucides 30.1 g/i)).toBeInTheDocument();
            expect(screen.getByText(/calories 197 kcal/i)).toBeInTheDocument();
        })
    })
})

describe("Search food", () => {
    it("should show list of food", async () => {
        render( <TestComponent/>)
        await waitFor(() => {
            const foods = within(screen.getByRole("list", {name: /liste des aliments/i})).getAllByRole("listitem");
            expect(foods).toHaveLength(2);
            expect(foods[0]).toHaveAccessibleName(/poulet/i)
            expect(foods[1]).toHaveAccessibleName(/banane/i)
        })
    })

    it("should select and unselect food in the food's list", async () => {
        render( <TestComponent/>)
        fireEvent.click(await screen.findByText(/banane/i));
        await waitFor(() => {
            expect(screen.getByTestId(/food-banane/i)).toHaveAttribute("aria-selected", "true")
        })
        fireEvent.click(screen.getByText(/banane/i));
        await waitFor(() => {
            expect(screen.getByTestId(/food-banane/i)).toHaveAttribute("aria-selected", "false")
        })
    })

    it("should open add food dialog", async () => {
        render( <TestComponent/>)
        fireEvent.click(screen.getByRole("button", {name: /ajouter un aliment à la liste/i}));
        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        })
    })

    it("should show nutrient info on food hover", async () => {
        render( <TestComponent/>)
        const foods = await screen.findByRole("list", {name: /liste des aliments/i});
        const food = within(foods).getByText(/banane/i);
        fireEvent.mouseEnter(food)
        await waitFor(() => {
            expect(screen.getByRole("tooltip", {name: /information sur banane/i })).toBeInTheDocument()
        })
        fireEvent.mouseLeave(food)
        await waitFor(() => {
            expect(screen.queryByRole("tooltip", {name: /information sur banane/i})).not.toBeInTheDocument()
        })
    })

    it("should delete food from list", async () => {
        const deleteFood = jest.fn()
        render( <TestComponent api={{deleteFood}} />)
        const food = await screen.findByRole("listitem" ,{name: /banane/i});
        fireEvent.click(within(food).getByRole("button", {name: /supprimer/i}))
        await waitFor(() => {
            expect(deleteFood).toHaveBeenCalledWith("2")
            expect(screen.queryByRole("listitem", {name: /banane/i})).not.toBeInTheDocument();
        })
    })

    it("should add new food", async () => {
        const addFood = jest.fn(() => uuid())
        render( <TestComponent api={{addFood}} />)
        fireEvent.click(screen.getByRole("button", {name: /ajouter un aliment à la liste/i}));
        fireEvent.change(await screen.findByLabelText(/nom de l'aliment/i), {target: {value: "Boeuf"}})
        const dialog = screen.getByRole("dialog");
        fireEvent.change(within(dialog).getByLabelText(/protéine/i), {target: {value: "50"}})
        fireEvent.change(within(dialog).getByLabelText(/glucide/i), {target: {value: "30"}})
        fireEvent.change(within(dialog).getByLabelText(/lipide/i), {target: {value: "20"}})
        fireEvent.change(within(dialog).getByLabelText(/vitamine c$/i), {target: {value: "10"}})
        fireEvent.click(screen.getByRole("button", {name: /valider/i}))
        await waitFor(() => {
            expect(addFood).toHaveBeenCalledWith({
               name: "Boeuf",
               description: "",
               valuesFor: "100g",
               calories: 500,
               proteins: 50,
               carbs: 30,
               lipids: 20,
                nutrients: [
                    {
                        unit: "mg",
                        id: "vit_c",
                        name: "Vitamine C",
                        amount: 10
                    },
                    {
                        unit: "mg",
                        id: "min_pot",
                        name: "Potassium",
                        amount: 0
                    }
                ]
            } as UnidentifiedFood)
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        })
        await waitFor(() => {
            expect(screen.getByText(/boeuf/i)).toBeInTheDocument()
        })
    })

    it("should add new food with value for 1 unit", async () => {
        const addFoodToMeal = jest.fn()
        const getDays = jest.fn(() => ({
            ["Jour par défaut"]: [
                {name: "déjeuner", id: "1", foods: []},
            ]
        }))
        const foodId = uuid()
        const addFood = jest.fn(() => foodId)
        render( <TestComponent api={{addFood, getDays, addFoodToMeal}} />)
        fireEvent.click(screen.getByRole("button", {name: /ajouter un aliment à la liste/i}));
        fireEvent.change(await screen.findByLabelText(/nom de l'aliment/i), {target: {value: "Boeuf"}})
        const dialog = screen.getByRole("dialog");
        fireEvent.change(within(dialog).getByLabelText(/protéine/i), {target: {value: "50"}})
        fireEvent.change(within(dialog).getByLabelText(/valeurs pour/i), {target: {value: "unit"}})
        fireEvent.change(within(dialog).getByLabelText(/vitamine c$/i), {target: {value: "100"}})
        fireEvent.click(screen.getByRole("button", {name: /valider/i}))
        await waitFor(() => {
            expect(addFood).toHaveBeenCalledWith({
                name: "Boeuf",
                description: "",
                valuesFor: "unit",
                calories: 200,
                proteins: 50,
                carbs: 0,
                lipids: 0,
                nutrients: [
                    {
                        unit: "mg",
                        id: "vit_c",
                        name: "Vitamine C",
                        amount: 100
                    },
                    {
                        unit: "mg",
                        id: "min_pot",
                        name: "Potassium",
                        amount: 0
                    }
                ]
            } as UnidentifiedFood)
        })
        fireEvent.click(await screen.findByText(/boeuf/i));
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/quantité/i)).toHaveValue(1)
        })
        fireEvent.click(screen.getByRole("button", {name: /ajouter l'aliment/i}));
        await waitFor(() => {
            expect(addFoodToMeal).toHaveBeenCalledWith("1", foodId, {amount: 1} )
            expect(screen.getByText(/boeuf 1unit/i)).toBeInTheDocument();
            expect(screen.getByText(/protéines 50 g/i)).toBeInTheDocument();
            expect(screen.getByText(/100 mg/i)).toBeInTheDocument(); // vitamine C in g
        })
    })

    it("should filter the list", async () => {
        render( <TestComponent  />)
        await waitFor(() => {
            expect(screen.getByText(/poulet/i)).toBeInTheDocument()
            expect(screen.getByText(/banane/i)).toBeInTheDocument()
        })
        fireEvent.change(screen.getByLabelText(/rechercher un aliment/i),
            {target: {value: "ou"}})
        await waitFor(() => {
            expect(screen.getByText(/poulet/i)).toBeInTheDocument()
            expect(screen.queryByText(/banane/i)).not.toBeInTheDocument()
        })
    })

    it("should edit food", async () => {
        const updateFood = jest.fn()
        render( <TestComponent api={{updateFood}} />)
        const foodItem = await screen.findByRole("listitem", {name: /banane/i})
        fireEvent.click(within(foodItem).getByRole("button", {name: /editer/i}))
        await waitFor(() => {
            const dialog = screen.getByRole("dialog")
            expect(within(dialog).getByLabelText(/nom de l'aliment/i)).toHaveValue("Banane")
            expect(within(dialog).getByLabelText(/protéine/i)).toHaveValue(1.28)
            expect(within(dialog).getByLabelText(/lipide/i)).toHaveValue(0.39)
            expect(within(dialog).getByLabelText(/glucide/i)).toHaveValue(29.6)
            expect(within(dialog).getByLabelText(/vitamine c$/i)).toHaveValue(8.7)
        })
        const dialog = screen.getByRole("dialog")
        fireEvent.change(within(dialog).getByLabelText(/nom de l'aliment/i), {target: {value: "Banane plantin"}})
        fireEvent.change(within(dialog).getByLabelText(/vitamine c unité/i), {target: {value: "g"}})
        fireEvent.change(within(dialog).getByLabelText(/protéine/i), {target: {value: "10"}})
        fireEvent.click(within(dialog).getByRole("button", {name: /valider/i}))
        await waitFor(() => {
            expect(updateFood).toHaveBeenCalledWith("2",
                {
                    "name": "Banane plantin",
                    "description": "",
                    "valuesFor": "100g",
                    "proteins": 10,
                    "lipids": 0.39,
                    "carbs": 29.6,
                    "calories": 162,
                    "nutrients": [
                        {
                            "id": "vit_c",
                            "name": "Vitamine C",
                            "unit": "g",
                            "amount": 8.7
                        },
                        {
                            "id": "min_pot",
                            "name": "Potassium",
                            "unit": "mg",
                            "amount": 358
                        }
                    ]
                }
            )
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            expect(screen.getByRole("listitem", {name: /banane plantin/i})).toBeInTheDocument()
        })
    })
})
