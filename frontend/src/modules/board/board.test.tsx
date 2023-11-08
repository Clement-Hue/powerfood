import {render, screen, fireEvent, waitFor, within} from "@testing";
import {Board} from "../index.ts";
import {ServicesProvider} from "@providers";
import {Nutrient} from "@typing/app.type.ts";
import {ServicesOverride} from "@providers/ServicesProvider/ServicesProvider.tsx";
import {v4 as uuid} from "uuid"

const TestComponent = ({api = {}}: {api?: ServicesOverride["apiService"]}) => {
    return (
        <ServicesProvider overrides={{
            apiService: {
                async getFoods() {
                    return [
                        {
                            "id": "1",
                            "name": "Poulet",
                            "proteins": 20,
                            "lipids": 0.39,
                            "carbs": 1,
                            "calories": 150,
                            nutrients: [
                                {
                                    "id": 1162,
                                    "name": "Vitamine C",
                                    "unit": "g",
                                    "value": 0.002
                                }
                            ]
                        },
                        {
                            "id": "2",
                            "name": "Banane",
                            "proteins": 1.28,
                            "lipids": 0.39,
                            "carbs": 29.6,
                            "calories": 122,
                            "nutrients": [
                                {
                                    "id": 1162,
                                    "name": "Vitamine C",
                                    "unit": "mg",
                                    "value": 8.7
                                },
                                {
                                    "id": 1092,
                                    "name": "Potassium",
                                    "unit": "mg",
                                    "value": 358
                                }
                            ]
                        }
                    ]
                },
                async getNutrients(): Promise<Nutrient[]> {
                    return [{
                       id: 1162,
                       name: "Vitamine C" ,
                        DRI: {
                           amount: 500,
                            unit: "g"
                        }
                    }]
                },
                addMeal: async () => uuid(),
                deleteMeal: async () => {},
                addFoodToMeal: async () => {},
                deleteFoodFromMeal: async () => {},
                ...api
            }
        }}>
            <Board/>
        </ServicesProvider>
    )
}
describe("Analyse", () => {
    it("should show nutrients summary", async () => {
        render( <TestComponent/>)
        await waitFor(() => {
            expect(within(screen.getByRole("list", {name: "Résultat"})).getByText("Vitamine C")).toBeInTheDocument()
            expect(within(screen.getByRole("list", {name: "Résultat"})).getByText("DRI: 500 g")).toBeInTheDocument()
        })
    })

    it("should add and remove meal", async () => {
        const mealId = "10";
        const addMeal = jest.fn(() => mealId)
        const deleteMeal = jest.fn()
        render( <TestComponent api={{addMeal, deleteMeal}}/>)
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
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

    it("should disable add food to meal button if no food selected or replace the food in the meal with new quantity", async () => {
        render( <TestComponent/>)
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        await waitFor(() => {
            expect(screen.getByRole("button", {name: /ajouter l'aliment/i})).toBeDisabled();
        })
        fireEvent.click(screen.getByText(/banane/i))
        fireEvent.click(screen.getByRole("button", {name: /ajouter l'aliment/i}) )
        fireEvent.change(screen.getByPlaceholderText(/quantité/i), {target: {value: "80"}})
        fireEvent.click(screen.getByRole("button", {name: /ajouter l'aliment/i}) )
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
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
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
            expect(addFoodToMeal).toHaveBeenCalledWith(mealId, "2", {amount: 80, unit: "g"})
            expect(within(meal).getByText(/banane 80g/i)).toBeInTheDocument()
            expect(screen.getByText(/0.007 g/i)).toBeInTheDocument()
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
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
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
            expect(screen.getByText(/0.019 g/i)).toBeInTheDocument() // Vitamine C
        })
        fireEvent.click(screen.getByRole("button", {name: /supprimer déjeuner/i}))
        await waitFor(() => {
            expect(screen.getByText(/0.009 g/i)).toBeInTheDocument()
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
        render( <TestComponent />)
        fireEvent.click(screen.getByRole("button", {name: /ajouter un aliment à la liste/i}));
        fireEvent.change(await screen.findByLabelText(/nom de l'aliment/i), {target: {value: "Boeuf"}})
        fireEvent.change(screen.getByLabelText(/protéine/i), {target: {value: "50"}})
        fireEvent.change(screen.getByLabelText(/glucide/i), {target: {value: "30"}})
        fireEvent.change(screen.getByLabelText(/lipide/i), {target: {value: "20"}})
        fireEvent.change(screen.getByLabelText(/calorie/i), {target: {value: "210"}})
        fireEvent.change(screen.getByLabelText(/vitamine c/i), {target: {value: "10"}})
        fireEvent.click(screen.getByRole("button", {name: /valider/i}))
        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        })
    })
})