import { computeCart } from '.'

describe('computeCart', () => {
    test('when cart is empty then it should cost 0', () => {
        expect(computeCart()).toBe(0)
    })
})