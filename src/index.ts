export class Cart {
    private total: number = 0
    addItem(item: /*{ item: Item, price: number, count?: number, weight?: number }*/Item) {
        this.total += item.cost()
    }
    cost(): number {
        return this.total
    }
}

export interface Item {
    cost(): number
}

export class ItemWithUnitPrice implements Item {
    constructor(private readonly price: number, private readonly count: number) { }

    cost(): number {
        return this.price * this.count
    }
}
export class ItemWithPricePerKilo implements Item {
    constructor(private readonly priceAtKg: number, private readonly grams: number) { }

    cost(): number {
        return Number((this.priceAtKg * this.grams / 1000).toFixed(2))
    }
}

type Discount = { count: number, newPrice: number }
export class ItemWithDiscountOffer implements Item {
    private price: number
    private count: number
    private discount: Discount
    constructor({ price, count, discount }:
        { price: number, count: number, discount: Discount }) {
        this.price = price
        this.count = count
        this.discount = discount
    }

    cost(): number {
        const discountApply = Math.floor(this.count / this.discount.count)
        return this.discount.newPrice * discountApply +
            this.price * (this.count - discountApply * this.discount.count)
    }
}

type ThresholdForFreeOffer = { thresholdForFree: number }
export class ItemWithOneFreeOffer implements Item {
    private price: number
    private count: number
    private offer: ThresholdForFreeOffer
    constructor({ price, count, offer }:
        { price: number, count: number, offer: ThresholdForFreeOffer }) {
        this.price = price
        this.count = count
        this.offer = offer
    }

    cost(): number {
        const batchSize = this.offer.thresholdForFree + 1
        const countBatch = Math.floor(this.count / batchSize)
        return this.price * this.offer.thresholdForFree * countBatch
            + this.price * (this.count - countBatch * batchSize)
    }
}