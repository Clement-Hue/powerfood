import {render} from "@testing";
import {Board} from "../index.ts";

describe("Board module", () => {
    it("should render board", () => {
        render(<Board/>)
    })
})