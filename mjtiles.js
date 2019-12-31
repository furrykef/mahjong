const _ = require('lodash')


const suits = Object.freeze({
    BAMS: 1,
    CRACKS: 2,
    DOTS: 3,
    DRAGONS: 4,
    WINDS: 5
})

const dragons = Object.freeze({
    WHITE: 1,
    GREEN: 2,
    RED: 3
})

const winds = Object.freeze({
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
    NORTH: 4
})


class Tile {
    constructor(suit, rank) {
        this.suit = suit
        this.rank = rank
    }

    toString() {
        switch (this.suit) {
        case suits.BAMS: return this.rank + "b"
        case suits.CRACKS: return this.rank + "c"
        case suits.DOTS: return this.rank + "d"

        case suits.DRAGONS:
            switch (this.rank) {
            case dragons.WHITE: return "Wh"
            case dragons.GREEN: return "G"
            case dragons.RED: return "R"
            default: return "[bad dragon]"
            }

        case suits.WINDS:
            switch (this.rank) {
            case winds.EAST: return "E"
            case winds.SOUTH: return "S"
            case winds.WEST: return "W"
            case winds.NORTH: return "N"
            default: return "[bad wind]"
            }

        default:
            return "[unknown]"
        }
    }
}


function shuffle() {
    let tiles = []
    for (let i = 0; i < 4; ++i) {
        for (let suit = 1; suit <= 3; ++suit) {
            for (let rank = 1; rank <= 9; ++rank) {
                tiles.push(new Tile(suit, rank))
            }
        }
        for (let dragon_type = 1; dragon_type <= 3; ++dragon_type) {
            tiles.push(new Tile(suits.DRAGONS, dragon_type))
        }
        for (let wind_type = 1; wind_type <= 4; ++wind_type) {
            tiles.push(new Tile(suits.WINDS, wind_type))
        }
    }
    return _.shuffle(tiles)
}


function sorted(tiles) {
    let result = tiles.slice(0)
    result.sort(function(a, b) {
        if (a.suit < b.suit) return -1
        if (a.suit > b.suit) return 1
        if (a.rank < b.rank) return -1
        if (a.rank > b.rank) return 1
        return 0
    })
    return result
}


function convStringToTile(str) {
    switch (str) {
    case "Wh": return new Tile(suits.DRAGONS, dragons.WHITE)
    case "G": return new Tile(suits.DRAGONS, dragons.GREEN)
    case "R": return new Tile(suits.DRAGONS, dragons.RED)
    case "E": return new Tile(suits.WINDS, winds.EAST)
    case "S": return new Tile(suits.WINDS, winds.SOUTH)
    case "W": return new Tile(suits.WINDS, winds.WEST)
    case "N": return new Tile(suits.WINDS, winds.NORTH)
    default:
        const match = /([1-9])([bcd])/.exec(str)
        if (!match) {
            return null
        }
        const rank = parseInt(match[1])
        let suit = null
        switch (match[2]) {
        case "b": suit = suits.BAMS; break
        case "c": suit = suits.CRACKS; break
        case "d": suit = suits.DOTS; break
        }
        return new Tile(suit, rank)
    }
}


module.exports.suits = suits
module.exports.dragons = dragons
module.exports.winds = winds
module.exports.shuffle = shuffle
module.exports.sorted = sorted
module.exports.convStringToTile = convStringToTile
