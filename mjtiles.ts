"use strict"

const _ = require('lodash')


export enum Suit {
    BAMS = 1,
    CRACKS,
    DOTS,
    DRAGONS,
    WINDS
}

export enum Dragon {
    WHITE = 1,
    GREEN,
    RED
}

export enum Wind {
    EAST = 1,
    SOUTH,
    WEST,
    NORTH
}


export class Tile {
    suit: Suit
    rank: number

    constructor(suit: Suit, rank: number) {
        this.suit = suit
        this.rank = rank
    }

    isHonor() {
        return this.suit === Suit.DRAGONS || this.suit === Suit.WINDS
    }

    isNumber() {
        return !this.isHonor()
    }

    toString() {
        switch (this.suit) {
        case Suit.BAMS: return this.rank + "b"
        case Suit.CRACKS: return this.rank + "c"
        case Suit.DOTS: return this.rank + "d"

        case Suit.DRAGONS:
            switch (this.rank) {
            case Dragon.WHITE: return "Wh"
            case Dragon.GREEN: return "G"
            case Dragon.RED: return "R"
            default: return "[bad dragon]"
            }

        case Suit.WINDS:
            switch (this.rank) {
            case Wind.EAST: return "E"
            case Wind.SOUTH: return "S"
            case Wind.WEST: return "W"
            case Wind.NORTH: return "N"
            default: return "[bad wind]"
            }

        default:
            return "[unknown]"
        }
    }
}


export function shuffle() {
    let tiles: Tile[] = []
    for (let i = 0; i < 4; ++i) {
        for (let suit of [Suit.BAMS, Suit.CRACKS, Suit.DOTS]) {
            for (let rank = 1; rank <= 9; ++rank) {
                tiles.push(new Tile(suit, rank))
            }
        }
        for (let dragon_type of [Dragon.WHITE, Dragon.GREEN, Dragon.RED]) {
            tiles.push(new Tile(Suit.DRAGONS, dragon_type))
        }
        for (let wind_type of [Wind.EAST, Wind.SOUTH, Wind.WEST, Wind.NORTH]) {
            tiles.push(new Tile(Suit.WINDS, wind_type))
        }
    }
    return _.shuffle(tiles)
}


export function sorted(tiles: Tile[]) {
    let result = tiles.slice(0)
    result.sort((a, b) => {
        if (a.suit < b.suit) return -1
        if (a.suit > b.suit) return 1
        if (a.rank < b.rank) return -1
        if (a.rank > b.rank) return 1
        return 0
    })
    return result
}


export function convStringToTile(str: string) {
    switch (str) {
    case "Wh": return new Tile(Suit.DRAGONS, Dragon.WHITE)
    case "G": return new Tile(Suit.DRAGONS, Dragon.GREEN)
    case "R": return new Tile(Suit.DRAGONS, Dragon.RED)
    case "E": return new Tile(Suit.WINDS, Wind.EAST)
    case "S": return new Tile(Suit.WINDS, Wind.SOUTH)
    case "W": return new Tile(Suit.WINDS, Wind.WEST)
    case "N": return new Tile(Suit.WINDS, Wind.NORTH)
    default:
        const match = /([1-9])([bcd])/.exec(str)
        if (!match) {
            return null
        }
        const rank = parseInt(match[1])
        let suit = Suit.BAMS
        switch (match[2]) {
        case "b": suit = Suit.BAMS; break
        case "c": suit = Suit.CRACKS; break
        case "d": suit = Suit.DOTS; break
        }
        return new Tile(suit, rank)
    }
}


export function convStringToTiles(str: string) {
    return str.split(' ').map((x) => convStringToTile(x))
}
