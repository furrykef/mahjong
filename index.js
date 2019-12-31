"use strict"

const _ = require('lodash')
const readlineSync = require('readline-sync')

const mjtiles = require('./mjtiles')


function main() {
    let wall = mjtiles.shuffle()
    let hand = []
    for (let i = 0; i < 13; ++i) {
        hand.push(wall.pop())
    }
    while (wall.length > 0) {
        hand = mjtiles.sorted(hand)
        const drawn_tile = wall.pop()
        console.log("Your hand is: %s | %s", handToString(hand), drawn_tile.toString())
        hand.push(drawn_tile)
        console.log("\n%d tiles remain\n", wall.length)
        while (true) {
            let discard = readlineSync.question("What do you discard? ")
            if (discard === "exit" || discard === "quit") {
                return
            }
            if (discard) {
                discard = mjtiles.convStringToTile(discard)
                if (!discard) {
                    console.log("That's not a valid tile!")
                    continue
                }
            } else {
                discard = drawn_tile
            }
            const index = _.findIndex(hand, discard)
            if (index === -1) {
                console.log("That's not in your hand!")
                continue
            }
            hand.splice(index, 1)
            break
        }
    }
    console.log("No more tiles")
}


function handToString(hand) {
    let result = ""
    for (let i = 0; i < hand.length; ++i) {
        result += hand[i].toString()
        if (i !== hand.length - 1) {
            result += " "
        }
    }
    return result
}


main()
