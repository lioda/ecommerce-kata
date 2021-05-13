export class Cart {
    private total: number = 0
    addItem(item: /*{ item: Item, price: number, count?: number, weight?: number }*/Item) {
        this.total += item.price.cost(item.count)
    }
    cost(): number {
        return this.total
    }
}

export type Item = {
    count: number
    price: Price
}
export interface Price {
    cost(count: number): number
}

export class PricePerUnit implements Price {
    constructor(private readonly price: number) { }

    cost(count: number): number {
        return this.price * count
    }
}
export class PricePerKilo implements Price {
    constructor(private readonly priceAtKg: number) { }

    cost(grams: number): number {
        return Number((this.priceAtKg * grams / 1000).toFixed(2))
    }
}

type Discount = { count: number, newPrice: number }
export class PriceWithDiscountOffer implements Price {
    private price: number
    private discount: Discount
    constructor({ price, discount }:
        { price: number, discount: Discount }) {
        this.price = price
        this.discount = discount
    }

    cost(count: number): number {
        const discountApply = Math.floor(count / this.discount.count)
        return this.discount.newPrice * discountApply +
            this.price * (count - discountApply * this.discount.count)
    }
}

type ThresholdForFreeOffer = { thresholdForFree: number }
export class PriceWithOneFree implements Price {
    private price: number
    private offer: ThresholdForFreeOffer
    constructor({ price, offer }:
        { price: number, offer: ThresholdForFreeOffer }) {
        this.price = price
        this.offer = offer
    }

    cost(count: number): number {
        const batchSize = this.offer.thresholdForFree + 1
        const countBatch = Math.floor(count / batchSize)
        return this.price * this.offer.thresholdForFree * countBatch
            + this.price * (count - countBatch * batchSize)
    }
}