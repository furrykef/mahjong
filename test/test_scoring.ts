import { expect } from 'chai'

import * as mjtiles from  '../mjtiles'
import * as scoring from  '../scoring'

describe("Basic hand scoring", function() {
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
        expect(scoring.hasYaku(yaku_list!, scoring.YakuType.SEVEN_PAIRS)).to.be.true
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

describe("3.0 Honor Tiles", function() {
    it("detects 3.1 Value Honor (White Dragon)", function() {
        const hand = mjtiles.convStringToTiles("123b 456c 789d HHH EE")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.VALUE_HONOR_WHITE]
            )
        ).to.be.true
    })
    it("detects 3.1 Value Honor (Green Dragon)", function() {
        const hand = mjtiles.convStringToTiles("123b 456c 789d GGG EE")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.VALUE_HONOR_GREEN]
            )
        ).to.be.true
    })
    it("detects 3.1 Value Honor (Red Dragon)", function() {
        const hand = mjtiles.convStringToTiles("123b 456c 789d RRR EE")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.VALUE_HONOR_RED]
            )
        ).to.be.true
    })
    it("detects 3.1 Value Honor (Seat Wind)", function() {
        // @XXX@ how to specify which wind is the seat wind?
        const hand = mjtiles.convStringToTiles("123b 456c 789d EEE HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.VALUE_HONOR_SEAT]
            )
        ).to.be.true
    })
})

describe("4.0 Triplets and Kong", function() {
    it("detects 4.1 All Triplets", function() {
        const hand = mjtiles.convStringToTiles("111333555777b HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.ALL_TRIPLETS]
            )
        ).to.be.true
    })
})

describe("10.0 Irregular Hands", function() {
    it("detects 10.1 Thirteen Terminals", function() {
        const hand = mjtiles.convStringToTiles("19b 19c 19d ESWN HGRR")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.THIRTEEN_TERMINALS]
            )
        ).to.be.true
    })

    it("detects 10.2 Seven Pairs", function() {
        const hand = mjtiles.convStringToTiles("11b 33b 55b 77b 99b 11c 33c")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.SEVEN_PAIRS]
            )
        ).to.be.true
    })
    it("detects 10.2 Seven Pairs (four of a kind)", function() {
        const hand = mjtiles.convStringToTiles("11b 33b 55b 77b 99b 1111c")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.SEVEN_PAIRS]
            )
        ).to.be.true
    })
})
