import { expect } from 'chai'

import * as mjtiles from  './mjtiles'
import * as mjset from './mjset'

describe("Test mjset", function() {
    it("detects triplets", function() {
        const tiles = mjtiles.convStringToTiles("111b")
        const set = new mjset.Set(tiles, true)
        expect(set.isTriplet).to.be.true
        expect(set.isKong).to.be.false
        expect(set.isRun).to.be.false
        expect(set.isPair).to.be.false
    })

    it("detects kongs", function() {
        const tiles = mjtiles.convStringToTiles("HHHH")
        const set = new mjset.Set(tiles, true)
        expect(set.isTriplet).to.be.true
        expect(set.isKong).to.be.true
        expect(set.isRun).to.be.false
        expect(set.isPair).to.be.false
    })

    it("detects runs", function() {
        const tiles = mjtiles.convStringToTiles("123b")
        const set = new mjset.Set(tiles, true)
        expect(set.isRun).to.be.true
        expect(set.isTriplet).to.be.false
        expect(set.isKong).to.be.false
        expect(set.isPair).to.be.false
    })

    it("detects pairs", function() {
        const tiles = mjtiles.convStringToTiles("11b")
        const set = new mjset.Set(tiles, true)
        expect(set.isPair).to.be.true
        expect(set.isTriplet).to.be.false
        expect(set.isKong).to.be.false
        expect(set.isRun).to.be.false
    })

    it("detects suit", function() {
        const tiles = mjtiles.convStringToTiles("123b")
        const set = new mjset.Set(tiles, true)
        expect(set.suit).to.equal(mjtiles.Suit.BAMS)
    })

    it("can change suit", function() {
        const tiles = mjtiles.convStringToTiles("123b")
        const set1 = new mjset.Set(tiles, true)
        const set2 = set1.changeSuit(mjtiles.Suit.CRACKS)
        expect(set2.suit).to.equal(mjtiles.Suit.CRACKS)
    })

    it("can match runs", function() {
        const tiles1 = mjtiles.convStringToTiles("123b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("123b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.true
        expect(set2.matches(set1)).to.be.true
    })

    it("doesn't match runs of different ranks", function() {
        const tiles1 = mjtiles.convStringToTiles("123b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("234b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.false
        expect(set2.matches(set1)).to.be.false
    })

    it("doesn't match runs of different suits", function() {
        const tiles1 = mjtiles.convStringToTiles("123b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("123c")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.false
        expect(set2.matches(set1)).to.be.false
    })

    it("can match triplets", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("111b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.true
        expect(set2.matches(set1)).to.be.true
    })

    it("doesn't match triplets of different ranks", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("222c")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.false
        expect(set2.matches(set1)).to.be.false
    })

    it("doesn't match triplets of different suits", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("111c")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.false
        expect(set2.matches(set1)).to.be.false
    })

    it("can match pure triplets and kongs", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("1111b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.true
        expect(set2.matches(set1)).to.be.true
    })

    it("doesn't match triplets and pairs", function() {
        const tiles1 = mjtiles.convStringToTiles("11b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("111b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matches(set2)).to.be.false
        expect(set2.matches(set1)).to.be.false
    })

    it("can bump runs", function() {
        const tiles1 = mjtiles.convStringToTiles("123b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("456b")
        const set2 = new mjset.Set(tiles2, true)
        const bumped = set1.bump(3)
        expect(bumped.matches(set2)).to.be.true
        expect(set2.matches(bumped)).to.be.true
    })

    it("can bump triplets", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("222b")
        const set2 = new mjset.Set(tiles2, true)
        const bumped = set1.bump(1)
        expect(bumped.matches(set2)).to.be.true
        expect(set2.matches(bumped)).to.be.true
    })

    it("can match small-or-big triplets with triplets", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("111b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.true
        expect(set2.matchSmallOrBig(set1)).to.be.true
    })

    it("doesn't match small-or-big triplets with different ranks", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("222b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.false
        expect(set2.matchSmallOrBig(set1)).to.be.false
    })

    it("doesn't match small-or-big triplets with different suits", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("111c")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.false
        expect(set2.matchSmallOrBig(set1)).to.be.false
    })

    it("can match small-or-big pairs with triplets", function() {
        const tiles1 = mjtiles.convStringToTiles("11b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("111b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.true
        expect(set2.matchSmallOrBig(set1)).to.be.true
    })

    it("doesn't match small-or-big pairs and triplets with different ranks", function() {
        const tiles1 = mjtiles.convStringToTiles("11b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("222b")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.false
        expect(set2.matchSmallOrBig(set1)).to.be.false
    })

    it("doesn't match small-or-big pairs and triplets with different suits", function() {
        const tiles1 = mjtiles.convStringToTiles("11b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("111c")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.false
        expect(set2.matchSmallOrBig(set1)).to.be.false
    })

    it("doesn't match small-or-big pairs triplets with runs", function() {
        const tiles1 = mjtiles.convStringToTiles("111b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("123c")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.false
        expect(set2.matchSmallOrBig(set1)).to.be.false
    })

    it("doesn't match small-or-big pairs pairs with runs", function() {
        const tiles1 = mjtiles.convStringToTiles("11b")
        const set1 = new mjset.Set(tiles1, true)
        const tiles2 = mjtiles.convStringToTiles("123c")
        const set2 = new mjset.Set(tiles2, true)
        expect(set1.matchSmallOrBig(set2)).to.be.false
        expect(set2.matchSmallOrBig(set1)).to.be.false
    })
})
