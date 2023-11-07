import {render, screen, fireEvent, waitFor, within} from "@testing";
import {Board} from "../index.ts";
import {ServicesProvider} from "@providers";
import {Nutrient} from "@typing/app.type.ts";

const TestComponent = () => {
    return (
        <ServicesProvider overrides={{
            apiService: {
                async getFoods() {
                    return [
                        {
                            "id": 2,
                            "name": "Poulet",
                            "proteins": 20,
                            "lipids": 0.39,
                            "carbs": 1,
                            "calories": 150,
                            nutrients: [
                                {
                                    "id": 1162,
                                    "name": "Vitamine C",
                                    "unit": "mg",
                                    "value": 2
                                }
                            ]
                        },
                        {
                            "id": 1,
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
                }
            }
        }}>
            <Board/>
        </ServicesProvider>
    )
}
describe("Board module", () => {
    it("should show nutrients summary", async () => {
        render( <TestComponent/>)
        await waitFor(() => {
            expect(within(screen.getByRole("list", {name: "Résultat"})).getByText("Vitamine C")).toBeInTheDocument()
            expect(within(screen.getByRole("list", {name: "Résultat"})).getByText("DRI: 500 g")).toBeInTheDocument()
        })
    })

    it("should add and remove meal", async () => {
        render( <TestComponent/>)
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"})); // should add one time
        await waitFor(() => {
            expect(screen.getByRole("region", {name: "déjeuner"})).toBeInTheDocument();
        })
        fireEvent.click(screen.getByRole("button", {name: /supprimer déjeuner/i}));
        await waitFor(() => {
            expect(screen.queryByRole("region", {name: "déjeuner"})).not.toBeInTheDocument();
        })
    })

    it("should show list of food", async () => {
        render( <TestComponent/>)
        await waitFor(() => {
            const foods = within(screen.getByRole("list", {name: /liste des aliments/i})).getAllByRole("listitem");
            expect(foods).toHaveLength(2);
            expect(foods[0]).toHaveAccessibleName(/poulet/i)
            expect(foods[1]).toHaveAccessibleName(/banane/i)
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

    it("should add selected food to meal and remove it", async () => {
        render( <TestComponent/>)
        const food = await screen.findByText(/banane/i)
        fireEvent.click(food);
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.change(await screen.findByPlaceholderText(/quantité/i), {target: {value: "80"}})
        fireEvent.click(await screen.findByRole("button", {name: /ajouter l'aliment/i}));
        fireEvent.click(await screen.findByRole("button", {name: /ajouter l'aliment/i}));// should add only one time
        const meal = screen.getByRole("region", {name: "déjeuner"});
        await waitFor(() => {
            expect(within(meal).getByText(/banane 80g/i)).toBeInTheDocument()
            expect(screen.getByText(/7 mg/i)).toBeInTheDocument()
        })
        expect(within(meal).getByText(/banane 80g/i)).toBeInTheDocument()
        fireEvent.click(within(meal).getByRole("button", {name: /supprimer banane/i}))
        await waitFor(() => {
            expect(within(meal).queryByText(/banane 80g/i)).not.toBeInTheDocument()
        })
    })

    it("should create several meals and compute total nutrients", async () => {
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
            expect(screen.getByText(/20 mg/i)).toBeInTheDocument() // Vitamine C
        })
    })

    it("should open add food dialog", async () => {
        render( <TestComponent/>)
        fireEvent.click(screen.getByRole("button", {name: /ajouter un aliment à la liste/i}));
        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        })
    })

    it("should not add food if quantity is 0g", async () => {
        render( <TestComponent/>)
        const food = await screen.findByText(/banane/i)
        fireEvent.click(food);
        fireEvent.change(screen.getByRole("textbox", {name: "Repas"}), {target: {value: "déjeuner"}})
        fireEvent.click(screen.getByRole("button", {name: "Ajouter un repas"}));
        fireEvent.change(await screen.findByPlaceholderText(/quantité/i), {target: {value: "0"}})
        fireEvent.click(await screen.findByRole("button", {name: /ajouter l'aliment/i}));
        const meal = screen.getByRole("region", {name: "déjeuner"});
        await waitFor(() => {
            expect(within(meal).queryByText(/banane/i)).not.toBeInTheDocument()
        })
    })

})