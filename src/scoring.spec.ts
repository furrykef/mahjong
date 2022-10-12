import { expect } from 'chai'

import * as mjtiles from  './mjtiles'
import * as scoring from  './scoring'

const YT = scoring.YakuType


describe("Test scoring", function() {
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
            expect(scoring.hasYaku(yaku_list!, YT.SEVEN_PAIRS)).to.be.true
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


    function testYaku(hand: string, target_yaku_list: scoring.Yaku[]) {
        return function() {
            const yaku_list = scoring.scoreHand(mjtiles.convStringToTiles(hand))
            expect(scoring.compareYaku(yaku_list!, target_yaku_list)).to.be.true
        }
    }


    describe("1.0 Trivial Patterns", function() {
        it("detects 1.1 All Sequences",
           testYaku("123456b 456789c HH",
                    [YT.CONCEALED_HAND, YT.ALL_SEQUENCES]))

        // We skip 1.2 Concealed Hand since it's tested throughout

        it("detects 1.3 No Terminals",
           testYaku("222345b 234c 67855d",
                    [YT.CONCEALED_HAND, YT.NO_TERMINALS]))
        it("rejects 1.3 No Terminals if hand has honor pair",
           testYaku("222345b 234c 678d HH", [YT.CONCEALED_HAND]))
        it("rejects 1.3 No Terminals if hand has 1",
           testYaku("222345b 123c 67855d", [YT.CONCEALED_HAND]))
        it("rejects 1.3 No Terminals if hand has 9",
           testYaku("222345b 789c 67855d", [YT.CONCEALED_HAND]))
    })


    describe("2.0 One-Suit Patterns", function() {
        it("detects 2.1 Mixed One-Suit (honor pair)",
           testYaku("111333555789b HH",
                    [YT.CONCEALED_HAND, YT.MIXED_ONE_SUIT]))
        it("detects 2.1 Mixed One-Suit (honor triplet)",
           testYaku("12333355577b EEE",
                    [YT.CONCEALED_HAND, YT.MIXED_ONE_SUIT]))
        it("detects 2.1 Mixed One-Suit (all honors except pair)",
           testYaku("EEE WWW HHH GGG 55b",
                    [YT.CONCEALED_HAND,
                     YT.VALUE_HONOR_WHITE,
                     YT.VALUE_HONOR_GREEN,
                     YT.ALL_TRIPLETS,
                     YT.MIXED_ONE_SUIT]))
        it("detects 2.1 Mixed One-Suit (seven-pair)",
           testYaku("112244556677b HH",
                    [YT.SEVEN_PAIRS, YT.MIXED_ONE_SUIT]))

        it("detects 2.2 Pure One-Suit (regular)",
           testYaku("11133355578999b",
                    [YT.CONCEALED_HAND, YT.PURE_ONE_SUIT]))
        it("detects 2.2 Pure One-Suit (seven-pair)",
           testYaku("11224455667799b",
                    [YT.SEVEN_PAIRS, YT.PURE_ONE_SUIT]))
    })


    describe("3.0 Honor Tiles", function() {
        it("detects 3.1 Value Honor (White Dragon)",
           testYaku("123b 456c 789d HHH EE",
                    [YT.CONCEALED_HAND, YT.VALUE_HONOR_WHITE]))
        it("detects 3.1 Value Honor (Green Dragon)",
           testYaku("123b 456c 789d GGG EE",
                    [YT.CONCEALED_HAND, YT.VALUE_HONOR_GREEN]))
        it("detects 3.1 Value Honor (Red Dragon)",
           testYaku("123b 456c 789d RRR EE",
                    [YT.CONCEALED_HAND,
                     YT.VALUE_HONOR_RED]))
        it("detects 3.1 Value Honor (Seat Wind)",
           // @XXX@ how to specify which wind is the seat wind?
           testYaku("123b 456c 789d EEE HH", [YT.CONCEALED_HAND, YT.VALUE_HONOR_SEAT]))

        it("detects 3.2.1 Small Three Dragons",
           testYaku("123b 456c HHH GGG RR",
                    [YT.CONCEALED_HAND,
                     YT.SMALL_THREE_DRAGONS,
                     YT.VALUE_HONOR_WHITE,
                     YT.VALUE_HONOR_GREEN]))
        it("rejects 3.2.1 Small Three Dragons with no dragon pair",
           testYaku("123b 456c HHH GGG EE",
                    [YT.CONCEALED_HAND,
                     YT.VALUE_HONOR_WHITE,
                     YT.VALUE_HONOR_GREEN]))

        it("detects 3.2.2 Big Three Dragons",
           testYaku("123b HHH GGG RRR 55c",
                    [YT.CONCEALED_HAND,
                     YT.BIG_THREE_DRAGONS,
                     YT.VALUE_HONOR_WHITE,
                     YT.VALUE_HONOR_GREEN,
                     YT.VALUE_HONOR_RED]))

        it("detects 3.3.1 Small Three Winds",
           testYaku("123b 456c EEE SSS WW",
                    [YT.CONCEALED_HAND, YT.SMALL_THREE_WINDS]))
        it("rejects 3.3.1 Small Three Winds with no wind pair",
           testYaku("123b 456c EEE SSS HH", [YT.CONCEALED_HAND]))

        it("detects 3.3.2 Big Three Winds",
           testYaku("123b EEE SSS WWW 55c",
                    [YT.CONCEALED_HAND, YT.BIG_THREE_WINDS]))

        it("detects 3.3.3 Small Four Winds",
          testYaku("123b EEE SSS WWW NN", [YT.SMALL_FOUR_WINDS]))
        it("rejects 3.3.3 Small Four Winds with no wind pair",
           testYaku("123b EEE SSS WWW 55c",
                    [YT.CONCEALED_HAND, YT.BIG_THREE_WINDS]))

        it("detects 3.3.4 Big Four Winds",
           testYaku("EEE SSS WWW NNN 55b", [YT.BIG_FOUR_WINDS]))

        it("detects 3.4 All Honors (standard)",
           testYaku("EEE SSS WWW GGG HH", [YT.ALL_HONORS]))
        it("detects 3.4 All Honors (seven-pair)",
           testYaku("EE SS WW NN HH GG RR", [YT.ALL_HONORS]))
    })


    describe("4.0 Triplets and Kong", function() {
        it("detects 4.1 All Triplets",
           testYaku("111333555777b 55c",
                    [YT.CONCEALED_HAND, YT.ALL_TRIPLETS]))
    })


    describe("5.0 Identical Sets", function() {
        it("detects 5.1.1 Two Identical Sequences",
           testYaku("123123b 333c EEE HH",
                    [YT.CONCEALED_HAND, YT.TWO_IDENTICAL_SEQUENCES]))

        it("detects 5.1.2 Two Identical Sequences Twice",
           testYaku("123123b 456456c HH",
                    [YT.CONCEALED_HAND,
                     YT.ALL_SEQUENCES,
                     YT.TWO_IDENTICAL_SEQUENCES_TWICE]))

        it("detects 5.1.3 Three Identical Sequences",
           testYaku("123123123b 456c HH",
                    [YT.CONCEALED_HAND,
                     YT.ALL_SEQUENCES,
                     YT.THREE_IDENTICAL_SEQUENCES]))

        it("detects 5.1.4 Four Identical Sequences",
           testYaku("123123123123b HH",
                    [YT.FOUR_IDENTICAL_SEQUENCES]))
    })


    describe("6.0 Similar Sets", function() {
        it("detects 6.1 Three Similar Sequences",
           testYaku("123b 123c 123d 555b HH",
                    [YT.CONCEALED_HAND, YT.THREE_SIMILAR_SEQUENCES]))

        it("detects 6.2.1 Small Three Similar Triplets",
           testYaku("555b 555c 55d 123b 789c",
                    [YT.CONCEALED_HAND, YT.SMALL_THREE_SIMILAR_TRIPLETS]))

        it("detects 6.2.2 Three Similar Triplets",
           testYaku("555b 555c 555d 123b HH",
                    [YT.CONCEALED_HAND, YT.THREE_SIMILAR_TRIPLETS]))
    })


    describe("7.0 Consecutive Sets", function() {
        it("detects 7.1 Nine-Tile Straight",
           testYaku("123456789b 111c HH",
                    [YT.CONCEALED_HAND, YT.NINE_TILE_STRAIGHT]))

        // If you don't add in All Triplets, it will be scored as
        // Three Identical Sequences instead
        it("detects 7.2.1 Three Consecutive Triplets (all triplets)",
           testYaku("111222333b 555c HH",
                    [YT.CONCEALED_HAND,
                     YT.ALL_TRIPLETS,
                     YT.THREE_CONSECUTIVE_TRIPLETS]))

         it("detects 7.2.2 Four Consecutive Triplets",
            testYaku("111222333444b 55c",
                     [YT.CONCEALED_HAND,
                      YT.ALL_TRIPLETS,
                      YT.FOUR_CONSECUTIVE_TRIPLETS]))
   })


    describe("8.0 Terminals", function() {
        it("detects 8.1.1 Mixed Lesser Terminals",
           testYaku("111b 789c EEE NNN HH",
                    [YT.CONCEALED_HAND, YT.MIXED_LESSER_TERMINALS]))

        it("detects 8.1.2 Pure Lesser Terminals",
           testYaku("111b 789b 123c 999c 11d",
                    [YT.CONCEALED_HAND, YT.PURE_LESSER_TERMINALS]))

        it("detects 8.1.3 Mixed Greater Terminals (regular)",
           testYaku("111b 999c EEE NNN HH",
                    [YT.CONCEALED_HAND,
                     YT.ALL_TRIPLETS,
                     YT.MIXED_GREATER_TERMINALS]))
        it("detects 8.1.3 Mixed Greater Terminals (seven-pair)",
           testYaku("1199b 1199c HH GG RR",
                    [YT.SEVEN_PAIRS,
                     YT.MIXED_GREATER_TERMINALS]))

        it("detects 8.1.4 Pure Greater Terminals (regular)",
           testYaku("111b 999b 111c 999c 11d",
                    [YT.PURE_GREATER_TERMINALS]))
        it("detects 8.1.4 Pure Greater Terminals (seven-pair)",
           testYaku("1199b 1199c 119999d",
                    [YT.PURE_GREATER_TERMINALS]))
    })


    describe("10.0 Irregular Hands", function() {
        it("detects 10.1 Thirteen Terminals",
           testYaku("19b 19c 19d ESWN HGRR",
                    [YT.THIRTEEN_TERMINALS]))

        it("detects 10.2 Seven Pairs",
           testYaku("11b 33b 55b 77b 99b 11c 33c",
                    [YT.SEVEN_PAIRS]))
        it("detects 10.2 Seven Pairs (four of a kind)",
           testYaku("11b 33b 55b 77b 99b 1111c",
                    [YT.SEVEN_PAIRS]))
    })
})
