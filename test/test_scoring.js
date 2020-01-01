"use strict"

const expect = require('chai').expect

const mjtiles = require('../mjtiles')
const scoring = require('../scoring')

describe("Mahjong hand scoring", function() {
    it("detects an incomplete hand", function() {
        const hand = mjtiles.convStringToTiles("2b 9b 6c 8c 1d 2d 2d 3d Wh G R R S W")
        const score = scoring.scoreHand(hand)
        expect(score).to.equal(0)
    })
    it("detects a basic complete hand", function() {
        const hand = mjtiles.convStringToTiles("3b 4b 5b 6b 6b 2c 2c 2c 7c 8c 9c 7d 8d 9d")
        const score = scoring.scoreHand(hand)
        expect(score).to.equal(5)
    })
    it("detects seven pairs", function() {
        const hand = mjtiles.convStringToTiles("1b 1b 3b 3b 5b 5b 7b 7b 9b 9b 1c 1c 3c 3c")
        const score = scoring.scoreHand(hand)
        expect(score).to.equal(35)
    })
})
