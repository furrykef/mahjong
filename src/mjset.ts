// Represents a set of tiles (meld or pair)
import * as _ from 'lodash'

import * as mjtiles from './mjtiles'

export class Set {
    readonly tiles: readonly mjtiles.Tile[]
    readonly concealed: boolean

    constructor(tiles: mjtiles.Tile[], concealed: boolean) {
        this.tiles = Object.freeze(tiles)
        this.concealed = concealed
    }

    get suit() {
        return this.tiles[0].suit
    }

    get isKong() {
        return this.tiles.length === 4
    }

    get isTriplet() {
        return this.tiles.length >= 3 && this.tiles[0].equals(this.tiles[1])
    }

    get isRun() {
        return !this.tiles[0].equals(this.tiles[1])
    }

    get isPair() {
        return this.tiles.length === 2
    }

    changeSuit(suit: mjtiles.Suit) {
        const tiles = this.tiles.map((x) => new mjtiles.Tile(suit, x.rank))
        return new Set(tiles, this.concealed)
    }

    // Two sets match if:
    //  * They are both the same run in the same suit
    //  * They are both the same triplet in the same suit,
    //      even if one is a kong and the other is not
    matches(other: Set) {
        return _.isEqual(this.tiles.slice(0, 3), other.tiles.slice(0, 3))
    }
}
