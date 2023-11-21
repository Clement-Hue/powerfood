import {render, fireEvent, screen, waitFor} from "@testing"
import Summary from "./Summary.tsx"

function TestComponent() {
    return (
        <Summary micros={[
            {
                name: "Vitamine A", id: "vit_a",
                value: {
                    amount: 300,
                    unit: "mcg"
                },
                DRI: {
                    amount: 800,
                    unit: "mcg"
                }
            }
        ]} />
    )
}

describe("Summary component", () => {
   it("should show nutrient graph on mouse oever", async () => {
      render(<TestComponent/>)
       fireEvent.mouseEnter(screen.getByRole("listitem", {name: "Vitamine A"}))
       await waitFor(() => {
           expect(screen.getByRole("tooltip")).toBeInTheDocument();
       })
       fireEvent.mouseLeave(screen.getByRole("listitem", {name: "Vitamine A"}))
       await waitFor(() => {
           expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
       })
   })
})