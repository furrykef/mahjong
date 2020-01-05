// Represents a set of tiles (meld or pair)
import * as mjtiles from './mjtiles'

export class Set {
    readonly tiles: mjtiles.Tile[]
    readonly concealed: boolean

    constructor(tiles: mjtiles.Tile[], concealed: boolean) {
        this.tiles = tiles
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
}
