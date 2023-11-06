import {render} from "@testing";
import {Board} from "../index.ts";
import {ServicesProvider} from "@providers";

const TestComponent = () => {
    return (
        <ServicesProvider overrides={{
            apiService: {
                getFoods() {
                    return []
                },
                getNutrients() {
                    return []
                }
            }
        }}>
            <Board/>
        </ServicesProvider>
    )
}
describe("Board module", () => {
    it("should render board", () => {
        render( <TestComponent/>)
    })
})