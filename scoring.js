"use strict"

const _ = require('lodash')

const mjtiles = require('./mjtiles')


const Yaku = {
    CHICKEN_HAND: {name: "Chicken Hand", value: 1},
    CONCEALED_HAND: {name: "Concealed Hand", value: 5},
    SEVEN_PAIRS: {name: "Seven Pairs", value: 30}
}


// Returns:
//  null if the hand is not complete
//  a list of yaku otherwise (zero-length if chicken hand)
function scoreHand(hand) {
    // @XXX@ This algorithm does not always handle ambiguous melds correctly.
    // @XXX@ No 13 Orphans

    const groups = groupTiles(hand)

    let triplets = 0
    let runs = 0
    let pairs = 0

    for (const group of groups) {
        const group_result = handleGroup(group)
        if (!group_result) {
            // Incomplete hand
            return null
        }
        triplets += group_result.triplets
        runs += group_result.runs
        pairs += group_result.pairs
    }

    let yaku_list = [Yaku.CONCEALED_HAND]

    if (pairs === 7) {
        // Seven-pair hand
        yaku_list.push(Yaku.SEVEN_PAIRS)
    } else if (pairs !== 1 || triplets + runs !== 4) {
        // Incomplete hand
        return null
    }

    return yaku_list
}


function hasYaku(yaku_list, what) {
    return _.findIndex(yaku_list, (x) => x.name === what.name) !== -1
}


// Group numbered tiles by suit; group honor tiles together
function groupTiles(hand) {
    hand = mjtiles.sorted(hand)
    return [
        hand.filter((x) => x.suit === mjtiles.suits.BAMS),
        hand.filter((x) => x.suit === mjtiles.suits.CRACKS),
        hand.filter((x) => x.suit === mjtiles.suits.DOTS),
        hand.filter((x) => x.isHonor())
    ].filter((arr) => arr.length > 0)
}


// @XXX@ forces only one interpretation of the group
// Some groups are ambiguous, like 11123444 (is it 111 234 44, or 11 123 444?)
function handleGroup(group) {
    let result = {triplets: 0, runs: 0, pairs: 0}
    if (group.length === 0) {
        // Terminate recursion
        return result
    }
    const num_first = countFirstElement(group)
    if (num_first >= 3) {
        // This might be a triplet (or triplet plus one, as in 111123),
        // but might not (as in 11123). So try it as a triplet first and
        // see what happens.
        const sub_result = handleGroup(group.slice(3))
        if (sub_result) {
            // This works as a triplet
            ++result.triplets
            return sumGroupResults(result, sub_result)
        }
    }
    if (num_first >= 2) {
        // This might be a pair of eyes
        const sub_result = handleGroup(group.slice(2))
        if (sub_result) {
            // This works as a pair of eyes
            ++result.pairs
            return sumGroupResults(result, sub_result)
        }
    }
    // This must be the start of a run, or else the group is invalid
    group = extractRun(group)
    if (group) {
        ++result.runs
        return sumGroupResults(result, handleGroup(group))
    }
    return null
}


function sumGroupResults(group1, group2) {
    if (!group1 || !group2) {
        return null
    }
    return {
        triplets: group1.triplets + group2.triplets,
        runs: group1.runs + group2.runs,
        pairs: group1.pairs + group2.pairs
    }
}


// Assuming the group is sorted, counts the number of copies of the
// first element in the group
function countFirstElement(group) {
    return _.takeWhile(group, (x) => _.isEqual(x, group[0])).length
}


// If the group starts with a run, returns the group minus the run
// If the group does not start with a run, returns null
// (Note that e.g. 12223 "starts with a run" for our purposes)
function extractRun(group) {
    const first = group[0]
    if (first.isHonor()) {
        // Can't have runs of honor tiles
        return null
    }
    const second = new mjtiles.Tile(first.suit, first.rank+1)
    const third = new mjtiles.Tile(first.suit, first.rank+2)
    group = group.slice(1)
    const second_idx = _.findIndex(group, second)
    if (second_idx === -1) {
        return null
    }
    group.splice(second_idx, 1)
    const third_idx = _.findIndex(group, third)
    if (third_idx === -1) {
        return null
    }
    group.splice(third_idx, 1)
    return group
}


exports.Yaku = Yaku
exports.scoreHand = scoreHand
exports.hasYaku = hasYaku
