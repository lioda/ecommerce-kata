export type Item = {
    price: number
} & (
        { weight: number } |
        { count: number, specialOffer?: { price: number, size: number }, oneFree?: { size: number } }
    )

export function computeCart(itemCost: (i: Item) => number, items: Item[]): number {
    return items.map(itemCost).reduce((acc, cost) => acc + cost, 0)
}

export function computeItem(item: Item): number {
    if ("weight" in item) {
        return Number((item.weight / 1000 * item.price).toFixed(2))
    }
    let costForOffers = 0
    let count = item.count
    if (item.specialOffer && item.count >= item.specialOffer.size) {
        const countOffers = Math.floor(item.count / item.specialOffer.size)
        count -= countOffers * item.specialOffer.size
        costForOffers = item.specialOffer.price * countOffers
    }
    if (item.oneFree) {
        const batchSize = item.oneFree.size + 1
        const countOffers = Math.floor(item.count / batchSize)
        count -= countOffers * batchSize
        costForOffers = countOffers * item.oneFree.size * item.price
    }
    return costForOffers + item.price * count
}