import { Item, Cart, PricePerKilo, PricePerUnit, PriceWithDiscountOffer, PriceWithOneFree } from '.'

describe('computeCart', () => {
    function countItemsAtCost(count: number, cost: number): Item {
        return {
            count,
            price: {
                cost: (mult) => cost * mult
            }
        }
    }
    describe('Cart', () => {
        test('when cart is empty then it should cost 0', () => {
            expect(new Cart().cost()).toBe(0)
        })
        test('when cart has items then it should cost total of items', () => {
            const cart = new Cart()
            cart.addItem(countItemsAtCost(2, 145))
            cart.addItem(countItemsAtCost(1, 12))
            cart.addItem(countItemsAtCost(5, 0.89))
            expect(cart.cost()).toBe(2 * 145 + 12 + 5 * 0.89)
        })
    })

    describe('PricePerUnit', () => {
        test('when many items then return price multiplied by count', () => {
            expect(new PricePerUnit(0.75).cost(2)).toBe(2 * 0.75)
        })
    })
    describe('PricePerKilo', () => {
        test('when more than 2 decimals then round up', () => {
            expect(new PricePerKilo(1.99).cost(1230)).toBe(2.45)
        })
    })
    describe('PriceWithDiscountOffer', () => {
        const discount = { count: 3, newPrice: 2 }

        test('when discount condition is reached then apply it', () => {
            expect(new PriceWithDiscountOffer({ price: 0.75, discount }).cost(3)).toBe(2)
        })
        test('when can apply discount many times then multiply new price', () => {
            expect(new PriceWithDiscountOffer({ price: 0.75, discount }).cost(9)).toBe(2 * 3)
        })
        test('when discount condition is not reach then apply cost per unit', () => {
            expect(new PriceWithDiscountOffer({ price: 0.75, discount }).cost(2)).toBe(0.75 * 2)
        })
        test('when more items than discount condition then apply it and count other items by unit', () => {
            expect(new PriceWithDiscountOffer({ price: 0.75, discount }).cost(5)).toBe(0.75 * 2 + 2)
        })
    })
    describe('PriceWithOneFree', () => {
        const offer = { thresholdForFree: 2 }

        test('when threshold condition is reached then apply it', () => {
            expect(new PriceWithOneFree({ price: 1.5, offer }).cost(3)).toBe(1.5 * 2)
        })
        test('when threshold condition is not reached then apply cost per unit', () => {
            expect(new PriceWithOneFree({ price: 1.5, offer }).cost(2)).toBe(1.5 * 2)
        })
        test('when more items than threshold condition then apply cost per unit for remaining items', () => {
            expect(new PriceWithOneFree({ price: 1.5, offer }).cost(4)).toBe(1.5 * 2 + 1.5)
        })
        test('when can apply offer many times then apply it as needed', () => {
            expect(new PriceWithOneFree({ price: 1.5, offer }).cost(6)).toBe(1.5 * 4)
        })
    })

})