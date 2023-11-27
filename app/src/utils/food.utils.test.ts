import { computeCalories } from "./food.util"


describe("Food util", () => {
    test("should compute calories", () => {
        expect( computeCalories(20, 4, 5)).toEqual(141);
    })
})

