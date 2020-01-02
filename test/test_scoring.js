"use strict"

const expect = require('chai').expect

const mjtiles = require('../js/mjtiles')
const scoring = require('../js/scoring')

describe("Mahjong hand scoring", function() {
    it("detects an incomplete hand", function() {
        const hand = mjtiles.convStringToTiles("29b 68c 1223d H G RR S W")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.be.null
    })
    it("detects a basic complete hand", function() {
        const hand = mjtiles.convStringToTiles("345b 66b 222c 789c 789d")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.not.be.null
    })
    it("detects a complete but scrambled hand", function() {
        const hand = mjtiles.convStringToTiles("2c 8d 35b 2c 6b 278c 79d 9c 46b")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.not.be.null
    })
    it("detects seven pairs", function() {
        const hand = mjtiles.convStringToTiles("11b 33b 55b 77b 99b 11c 33c")
        const yaku_list = scoring.scoreHand(hand)
        expect(scoring.hasYaku(yaku_list, scoring.YakuType.SEVEN_PAIRS)).to.be.true
    })
    it("does not allow runs of dragons", function() {
        const hand = mjtiles.convStringToTiles("345b 66b 222c 789c HGR")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.be.null
    })
    it("does not allow runs of winds", function() {
        const hand = mjtiles.convStringToTiles("345b 66b 222c 789c ESW")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.be.null
    })
    it("allows double runs", function() {
        const hand = mjtiles.convStringToTiles("123123b 77c 555d HHH")
        const yaku_list = scoring.scoreHand(hand)
        expect(yaku_list).to.not.be.null
    })
})
