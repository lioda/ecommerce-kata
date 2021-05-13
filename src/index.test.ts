import { computeCart, computeItem, Item } from '.'

describe('computeCart', () => {
    describe('computeCart', () => {

        const computeAsPrice = (item: Item) => item.price
        test('when cart is empty then it should return 0', () => {
            expect(computeCart(computeAsPrice, [])).toBe(0)
        })
        test('when cart has items then it apply computation for each and return total', () => {
            expect(computeCart(computeAsPrice, [
                { price: 0.75, count: 1 },
                { price: 1.5, count: 1 },
                { price: 12, count: 1 }
            ])).toBe(0.75 + 1.5 + 12)
        })
    })

    test('when item has price and cound then multiply price and count', () => {
        expect(computeItem({ price: 0.75, count: 2 })).toEqual(0.75 * 2)
    })
    test('when item has weight then multiply price per kilo and weight in kilo with fixed precision', () => {
        expect(computeItem({ price: 1.99, weight: 1230 })).toEqual(2.45 /* 1.99 * 1.230 */)
    })
    describe('specialOffer', () => {

        test('when item has special offer then apply it', () => {
            expect(computeItem({ price: 0.75, count: 3, specialOffer: { price: 2, size: 3 } })).toEqual(2)
        })

        test('when not enough items for special offer then not apply it', () => {
            expect(computeItem({ price: 0.75, count: 2, specialOffer: { price: 2, size: 3 } })).toEqual(0.75 * 2)
        })

        test('when more items than special offer then count remaining items by unit', () => {
            expect(computeItem({ price: 0.75, count: 8, specialOffer: { price: 2, size: 3 } })).toEqual(2 * 2 + 0.75 * 2)
        })
    })

    describe('oneItemFree', () => {
        test('when items has one item free then count one less', () => {
            expect(computeItem({ price: 1.5, count: 3, oneFree: { size: 2 } })).toEqual(1.5 * 2)
        })
        test('when not enough items then cost is by unit', () => {
            expect(computeItem({ price: 1.5, count: 2, oneFree: { size: 2 } })).toEqual(1.5 * 2)
        })
        test('when many bundles then apply one free for them and count remaining items by unit', () => {
            expect(computeItem({ price: 1.5, count: 7, oneFree: { size: 2 } })).toEqual(1.5 * 2 * 2 + 1.5)
        })
    })
})