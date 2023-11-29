import { getCalories } from "./food.util"


describe("Food util", () => {
    test("should compute calories", () => {
        expect( getCalories(20, 4, 5)).toEqual(141);
    })
})

