import FoodDialog from "./FoodDialog.tsx";
import {render, screen, fireEvent, waitFor} from "@testing"
import {ServicesProvider} from "@providers";

function TestComponent() {
    return (
        <ServicesProvider overrides={{foodApiService: {
                async searchFood() {
                   return {
                        common: [
                            {
                                food_name: "banana raw",
                                serving_qty: 100,
                            }
                        ]
                   }
                },
                async getFoodInfo() {
                   return {
                      foods: [
                          {
                              food_name: "banana raw",
                              serving_qty: 100,
                              nf_total_fat: 1,
                              nf_total_carbohydrate: 15,
                              nf_protein: 5,
                              full_nutrients: [
                                  {
                                      attr_id: 306,
                                      value: 10,
                                  }
                              ]
                          }
                      ]
                   }
                }
            }
        }}>
            <FoodDialog open />
        </ServicesProvider>
    )
}

function renderWithNutrients() {
    render(<TestComponent/>, {preloadedState: {
            nutrient: {
                nutrients: [{
                    id: "vit_c",
                    name: "Vitamine C" ,
                    DRI: {
                        amount: 500,
                        unit: "g"
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
            }
        }})
}

describe("FoodDialog component", () => {
    test("should search on the food api", async () => {
        renderWithNutrients();
        fireEvent.change( await screen.findByLabelText(/rechercher un aliment sur internet/i), {
            target: {value: "banana"}
        } )
        await waitFor(() => {
            expect(screen.getByText(/banana raw/i)).toBeInTheDocument();
        })
        fireEvent.click(screen.getByText(/banana raw/i))
        await waitFor(() => {
            expect(screen.getByLabelText(/nom de l'aliment/i)).toHaveValue("banana raw")
            expect(screen.getByLabelText(/lipide/i)).toHaveValue(1)
            expect(screen.getByLabelText(/glucide/i)).toHaveValue(15)
            expect(screen.getByLabelText(/protéine/i)).toHaveValue(5)
            expect(screen.getByLabelText(/^potassium$/i)).toHaveValue(10)
            expect(screen.getByLabelText(/rechercher un aliment sur internet/i)).toHaveValue("")
        })
        fireEvent.mouseDown(screen.getByLabelText(/rechercher un aliment sur internet/i));
        await waitFor(() => {
            expect(screen.getByText(/pas d'aliment/i)).toBeInTheDocument()
        })
    })
})