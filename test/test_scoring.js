"use strict"

const expect = require('chai').expect

const mjtiles = require('../js/mjtiles')
const scoring = require('../js/scoring')

describe("Mahjong hand scoring", function() {
    it("detects an incomplete hand", function() {
        const hand = mjtiles.convStringToTiles("2b 9b 6c 8c 1d 2d 2d 3d Wh G R R S W")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.be.null
    })
    it("detects a basic complete hand", function() {
        const hand = mjtiles.convStringToTiles("3b 4b 5b 6b 6b 2c 2c 2c 7c 8c 9c 7d 8d 9d")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.not.be.null
    })
    it("detects seven pairs", function() {
        const hand = mjtiles.convStringToTiles("1b 1b 3b 3b 5b 5b 7b 7b 9b 9b 1c 1c 3c 3c")
        const yaku_list = scoring.scoreHand(hand)
        expect(scoring.hasYaku(yaku_list, scoring.Yaku.SEVEN_PAIRS)).to.be.true
    })
    it("does not allow runs of dragons", function() {
        const hand = mjtiles.convStringToTiles("3b 4b 5b 6b 6b 2c 2c 2c 7c 8c 9c Wh G R")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.be.null
    })
    it("does not allow runs of winds", function() {
        const hand = mjtiles.convStringToTiles("3b 4b 5b 6b 6b 2c 2c 2c 7c 8c 9c E S W")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.be.null
    })
})
