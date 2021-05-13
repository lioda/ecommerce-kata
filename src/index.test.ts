import { computeCart } from '.'

describe('computeCart', () => {
    test('when cart is empty then it should return 0', () => {
        expect(computeCart()).toBe(0)
    })
})