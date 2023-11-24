import { render, screen } from "@testing";
import NutrientGraph from ".";

function TestComponent() {
    return <NutrientGraph nutrientId="vit_a"  dayName="Monday" position={{x: 10, y: 20}}/>
}

describe('NutrientGraph Component', () => {
    test('should show tooltip', () => {
        render(<TestComponent />);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    })
})
