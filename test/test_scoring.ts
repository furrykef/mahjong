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

describe("1.0 Trivial Patterns", function() {
    it("detects 1.1 All Sequences", function() {
        const hand = mjtiles.convStringToTiles("123456b 456789c HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.ALL_SEQUENCES]
            )
        ).to.be.true
    })

    // We skip 1.2 Concealed Hand since it's tested throughout

    it("detects 1.3 No Terminals", function() {
        const hand = mjtiles.convStringToTiles("222345b 234c 67855d")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.NO_TERMINALS]
            )
        ).to.be.true
    })
    it("rejects 1.3 No Terminals if hand has honor pair", function() {
        const hand = mjtiles.convStringToTiles("222345b 234c 678d HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND]
            )
        ).to.be.true
    })
    it("rejects 1.3 No Terminals if hand has 1", function() {
        const hand = mjtiles.convStringToTiles("222345b 123c 67855d")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND]
            )
        ).to.be.true
    })
    it("rejects 1.3 No Terminals if hand has 9", function() {
        const hand = mjtiles.convStringToTiles("222345b 789c 67855d")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND]
            )
        ).to.be.true
    })
})


describe("2.0 One-Suit Patterns", function() {
    it("detects 2.1 Mixed One-Suit", function() {
        const hand = mjtiles.convStringToTiles("111333555789b HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.MIXED_ONE_SUIT]
            )
        ).to.be.true
    })

    it("detects 2.2 Pure One-Suit", function() {
        const hand = mjtiles.convStringToTiles("11133355578999b")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.PURE_ONE_SUIT]
            )
        ).to.be.true
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

    it("detects 3.2.1 Small Three Dragons", function() {
        const hand = mjtiles.convStringToTiles("123b 456c HHH GGG RR")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.SMALL_THREE_DRAGONS,
                 scoring.YakuType.VALUE_HONOR_WHITE,
                 scoring.YakuType.VALUE_HONOR_GREEN]
            )
        ).to.be.true
    })
    it("rejects 3.2.1 Small Three Dragons with no dragon pair", function() {
        const hand = mjtiles.convStringToTiles("123b 456c HHH GGG EE")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.VALUE_HONOR_WHITE,
                 scoring.YakuType.VALUE_HONOR_GREEN]
            )
        ).to.be.true
    })

    it("detects 3.2.2 Big Three Dragons", function() {
        const hand = mjtiles.convStringToTiles("123b HHH GGG RRR EE")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.BIG_THREE_DRAGONS,
                 scoring.YakuType.VALUE_HONOR_WHITE,
                 scoring.YakuType.VALUE_HONOR_GREEN,
                 scoring.YakuType.VALUE_HONOR_RED]
            )
        ).to.be.true
    })

    it("detects 3.3.1 Small Three Winds", function() {
        const hand = mjtiles.convStringToTiles("123b 456c EEE SSS WW")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.SMALL_THREE_WINDS]
            )
        ).to.be.true
    })
    it("rejects 3.3.1 Small Three Winds with no wind pair", function() {
        const hand = mjtiles.convStringToTiles("123b 456c EEE SSS HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND]
            )
        ).to.be.true
    })

    it("detects 3.3.2 Big Three Winds", function() {
        const hand = mjtiles.convStringToTiles("123b EEE SSS WWW HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.BIG_THREE_WINDS]
            )
        ).to.be.true
    })

    it("detects 3.3.3 Small Four Winds", function() {
        const hand = mjtiles.convStringToTiles("123b EEE SSS WWW NN")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.SMALL_FOUR_WINDS]
            )
        ).to.be.true
    })
    it("rejects 3.3.3 Small Four Winds with no wind pair", function() {
        const hand = mjtiles.convStringToTiles("123b EEE SSS WWW HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.CONCEALED_HAND,
                 scoring.YakuType.BIG_THREE_WINDS]
            )
        ).to.be.true
    })

    it("detects 3.3.4 Big Four Winds", function() {
        const hand = mjtiles.convStringToTiles("EEE SSS WWW NNN 55b")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.BIG_FOUR_WINDS]
            )
        ).to.be.true
    })

    it("detects 3.4 All Honors (standard)", function() {
        const hand = mjtiles.convStringToTiles("EEE SSS WWW GGG HH")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.ALL_HONORS]
            )
        ).to.be.true
    })

    it("detects 3.4 All Honors (seven-pair)", function() {
        const hand = mjtiles.convStringToTiles("EE SS WW NN HH GG RR")
        const yaku_list = scoring.scoreHand(hand)
        expect(
            scoring.compareYaku(
                yaku_list!,
                [scoring.YakuType.ALL_HONORS]
            )
        ).to.be.true
    })
})

describe("4.0 Triplets and Kong", function() {
    it("detects 4.1 All Triplets", function() {
        const hand = mjtiles.convStringToTiles("111333555777b 55c")
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
