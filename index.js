"use strict"

const _ = require('lodash')
const readlineSync = require('readline-sync')
const yargs = require('yargs')

const mjtiles = require('./mjtiles')
const scoring = require('./scoring')


function main(argv) {
    argv = parseArgs(argv)
    let wall = mjtiles.shuffle()
    let hand = dealHand(wall, argv)
    while (wall.length > 0) {
        hand = mjtiles.sorted(hand)
        const drawn_tile = wall.pop()
        console.log("Your hand is: %s | %s", handToString(hand), drawn_tile.toString())
        hand.push(drawn_tile)
        /*const score = scoring.scoreHand(hand) 
        if (score > 0) {
            console.log("You have a mahjong worth %d point(s)!", score)
        }*/
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


function dealHand(wall, argv) {
    let hand = []
    if (argv.hand) {
        hand = mjtiles.convStringToTiles(argv.hand)
        if (hand.length > 13) {
            console.log("Warning: hand too long; truncating")
            hand.length = 13
        }
        // Remove corresponding tiles from wall
        for (const tile of hand) {
            let idx = _.findIndex(wall, (x) => _.isEqual(x, tile))
            wall.splice(idx, 1)
        }
    }
    if (hand.length < 13) {
        hand = hand.concat(wall.splice(0, 13 - hand.length))
    }
    return hand
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


function parseArgs(argv) {
    return yargs
        (argv)
        .option('hand', {
            description: "Deal yourself a particular hand",
            type: 'string'
        })
        .argv
}


main(process.argv)
