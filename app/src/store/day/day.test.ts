import { FoodDictionary } from "@typing/app.type"
import { daySelectors } from "."
import { RootState } from ".."

const foods: FoodDictionary = {
	"poulet_id": {
		"id": "poulet_id",
		"name": "Poulet",
		"valuesFor": "100g",
		"proteins": 20,
		"lipids": 0.39,
		"carbs": 1,
		"calories": 87.51,
		nutrients: [
			{
				"id": "vit_b1",
				"name": "Vitamine B1",
				"unit": "g",
				"amount": 0.002
			},
			{
				"id": "vit_a",
				"name": "Vitamine A",
				"unit": "mcg",
				"amount": 200
			}
		]
	},
	"banana_id": {
		"id": "banana_id",
		"name": "Banane",
		"valuesFor": "unit",
		"proteins": 1,
		"lipids": 5.39,
		"carbs": 10,
		"calories": 92.51,
		nutrients: [
			{
				"id": "vit_b1",
				"name": "Vitamine B1",
				"unit": "mg",
				"amount": 0
			},
			{
				"id": "vit_a",
				"name": "Vitamine A",
				"unit": "mcg",
				"amount": 25
			}
		]
	},
}

const defaultState: RootState = {
	nutrient: {
		nutrients: [
			{
				id: "vit_b1",
				name: "Vitamine B1" ,
				DRI: {
					amount: 500,
					unit: "mg"
				}
			},
			{
				id: "vit_a",
				name: "Vitamine A" ,
				DRI: {
					amount: 800,
					unit: "mcg"
				}
			}
		]
	},
	food: {
		selectedFoodId: null,
		foods
	},
	day: {
		days: {
			"Lundi": [
				{
					name: "déjeuner",
					id: "déj_id",
					foods: [
						{
							id: "poulet_id",
							amount: 80
						},
						{
							id: "banana_id",
							amount:1 
						}
					]
				},
				{
					name: "diner",
					id: "diner_id",
					foods: [{
						id: "poulet_id",
						amount: 200
					}]
				}
			]
		}
	}

}

describe('Day selectors', () => {

	test('should get micro nutrients foods', () => {
		expect(daySelectors.selectMicros(defaultState, "Lundi")).toEqual( [{
			id: "vit_b1",
			name: "Vitamine B1" ,
			foods: [{
				amount: 5.6,
				food: foods["poulet_id"]
			}],
			value: {
				unit: "mg",
				amount:5.6 
			},
			DRI: {
				amount: 500,
				unit: "mg"
			}
			},
			{
				id: "vit_a",
				name: "Vitamine A",
				foods: [{
					amount: 560,
					food: foods["poulet_id"]
					},
					{
						amount: 25,
						food: foods["banana_id"]
				}],
				value: {
					unit: "mcg",
					amount: 585
				},
				DRI: {
					amount: 800,
					unit: "mcg"
				}
		}])
	})

	test("should get macros nutrients", () => {
		expect(daySelectors.selectMacros(defaultState, "Lundi")).toEqual([
			{
				id: "calories",
				foods: [
					{
						food: foods["poulet_id"],
						amount: 245.02800000000002 
					},{
						food: foods["banana_id"],
						amount: 92.51
					}
				],
				amount: 337.538
			},
			{
				id: "proteins",
				foods: [
					{
						food: foods["poulet_id"],
						amount: 56
					},{
						food: foods["banana_id"],
						amount:1 
					}
				],
				amount:57
			},
			{
				id: "carbs",
				foods: [
					{
						food: foods["poulet_id"],
						amount: 2.8 
					},{
						food: foods["banana_id"],
						amount: 10
					}
				],
				amount: 12.8
			},
			{
				id: "lipids",
				foods: [
					{
						food: foods["poulet_id"],
						amount: 1.092
					},{
						food: foods["banana_id"],
						amount: 5.39
					}
				],
				amount:  6.481999999999999
			}
		])
	})

	test("should get macros calories", () => {
		expect(daySelectors.selectMacrosCalories(defaultState, "Lundi")).toEqual({
			"proteins": {
				calories: 228,
				percentage: 67.54795015672309,
			},
			"carbs": {
				calories: 51.2,
				percentage:15.16866249133431,
			},
			"lipids": {
				calories: 58.337999999999994,
				percentage: 17.283387351942594,
			}
		})
	})
})

