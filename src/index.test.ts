import { Item, Cart, ItemWithPricePerKilo, ItemWithUnitPrice, ItemWithDiscountOffer, ItemWithOneFreeOffer } from '.'

describe('computeCart', () => {
    function itemAtCost(cost: number): Item {
        return {
            cost: () => cost
        }
    }
    describe('Cart', () => {
        test('when cart is empty then it should cost 0', () => {
            expect(new Cart().cost()).toBe(0)
        })
        test('when cart has items then it should cost total of items', () => {
            const cart = new Cart()
            cart.addItem(itemAtCost(145))
            cart.addItem(itemAtCost(12))
            cart.addItem(itemAtCost(0.89))
            expect(cart.cost()).toBe(145 + 12 + 0.89)
        })
    })

    describe('ItemWithUnitPrice', () => {
        test('when many items then return price multiplied by count', () => {
            expect(new ItemWithUnitPrice(0.75, 2).cost()).toBe(2 * 0.75)
        })
    })
    describe('ItemWithPricePerKilo', () => {
        test('when more than 2 decimals then round up', () => {
            expect(new ItemWithPricePerKilo(1.99, 1230).cost()).toBe(2.45)
        })
    })
    describe('ItemWithDiscountOffer', () => {
        const discount = { count: 3, newPrice: 2 }

        test('when discount condition is reached then apply it', () => {
            expect(new ItemWithDiscountOffer({ price: 0.75, count: 3, discount }).cost()).toBe(2)
        })
        test('when can apply discount many times then multiply new price', () => {
            expect(new ItemWithDiscountOffer({ price: 0.75, count: 9, discount }).cost()).toBe(2 * 3)
        })
        test('when discount condition is not reach then apply cost per unit', () => {
            expect(new ItemWithDiscountOffer({ price: 0.75, count: 2, discount }).cost()).toBe(0.75 * 2)
        })
        test('when more items than discount condition then apply it and count other items by unit', () => {
            expect(new ItemWithDiscountOffer({ price: 0.75, count: 5, discount }).cost()).toBe(0.75 * 2 + 2)
        })
    })
    describe('ItemWithOneFreeOffer', () => {
        const offer = { thresholdForFree: 2 }

        test('when threshold condition is reached then apply it', () => {
            expect(new ItemWithOneFreeOffer({ price: 1.5, count: 3, offer }).cost()).toBe(1.5 * 2)
        })
        test('when threshold condition is not reached then apply cost per unit', () => {
            expect(new ItemWithOneFreeOffer({ price: 1.5, count: 2, offer }).cost()).toBe(1.5 * 2)
        })
        test('when more items than threshold condition then apply cost per unit for remaining items', () => {
            expect(new ItemWithOneFreeOffer({ price: 1.5, count: 4, offer }).cost()).toBe(1.5 * 2 + 1.5)
        })
        test('when can apply offer many times then apply it as needed', () => {
            expect(new ItemWithOneFreeOffer({ price: 1.5, count: 6, offer }).cost()).toBe(1.5 * 4)
        })
    })

})