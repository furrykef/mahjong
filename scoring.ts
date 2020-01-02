import * as _ from 'lodash'

import * as mjtiles from './mjtiles'


export const Yaku = Object.freeze({
    CHICKEN_HAND: {name: "Chicken Hand", value: 1},
    ALL_SEQUENCES: {name: "All Sequences", value: 5},
    CONCEALED_HAND: {name: "Concealed Hand", value: 5},
    NO_TERMINALS: {name: "All Simples", value: 5},
    MIXED_ONE_SUIT: {name: "Half Flush", value: 40},
    PURE_ONE_SUIT: {name: "Full Flush", value: 80},
    NINE_GATES: {name: "Nine Gates", value: 480},
    VALUE_HONOR_WHITE: {name: "Triplet of Dragons (White)", value: 10},
    VALUE_HONOR_GREEN: {name: "Triplet of Dragons (Green)", value: 10},
    VALUE_HONOR_RED: {name: "Triplet of Dragons (Red)", value: 10},
    VALUE_HONOR_SEAT: {name: "Triplet of Seat Wind", value: 10},
    SMALL_THREE_DRAGONS: {name: "Small Three Dragons", value: 40},
    BIG_THREE_DRAGONS: {name: "Big Three Dragons", value: 130},
    SMALL_THREE_WINDS: {name: "Small Three Winds", value: 30},
    BIG_THREE_WINDS: {name: "Big Three Winds", value: 120},
    SMALL_FOUR_WINDS: {name: "Small Four Winds", value: 320},
    BIG_FOUR_WINDS: {name: "Big Four Winds", value: 400},
    ALL_HONORS: {name: "All Honors", value: 320},
    ALL_TRIPLETS: {name: "All Triplets", value: 30},
    TWO_CONCEALED_TRIPLETS: {name: "Two Concealed Triplets", value: 5},
    THREE_CONCEALED_TRIPLETS: {name: "Three Concealed Triplets", value: 30},
    FOUR_CONCEALED_TRIPLETS: {name: "Four Concealed Triplets", value: 125},
    ONE_KONG: {name: "One Kong", value: 5},
    TWO_KONG: {name: "Two Kongs", value: 20},
    THREE_KONG: {name: "Three Kongs", value: 120},
    FOUR_KONG: {name: "Four Kongs", value: 480},
    TWO_IDENTICAL_SEQUENCES: {name: "Two Identical Sequences", value: 10},
    TWO_IDENTICAL_SEQUENCES_TWICE: {name: "Two Identical Sequences Twice", value: 60},
    THREE_IDENTICAL_SEQUENCES: {name: "Three Identical Sequences", value: 120},
    FOUR_IDENTICAL_SEQUENCES: {name: "Four Identical Sequences", value: 480},
    THREE_SIMILAR_SEQUENCES: {name: "Three Similar Sequences", value: 35},
    SMALL_THREE_SIMILAR_TRIPLETS: {name: "Small Three Similar Triplets", value: 30},
    THREE_SIMILAR_TRIPLETS: {name: "Three Similar Triplets", value: 120},
    NINE_TILE_STRAIGHT: {name: "Nine-Tile Straight", value: 40},
    THREE_CONSECUTIVE_TRIPLETS: {name: "Three Consecutive Triplets", value: 100},
    FOUR_CONSECUTIVE_TRIPLETS: {name: "Four Consecutive Triplets", value: 200},
    MIXED_LESSER_TERMINALS: {name: "Mixed Lesser Terminals", value: 40},
    PURE_LESSER_TERMINALS: {name: "Pure Lesser Terminals", value: 50},
    MIXED_GREATER_TERMINALS: {name: "Mixed Greater Terminals", value: 100},
    PURE_GREATER_TERMINALS: {name: "Pure Greater Terminals", value: 400},
    FINAL_DRAW: {name: "Final Draw", value: 10},
    FINAL_DISCARD: {name: "Final Discard", value: 10},
    WIN_ON_KONG: {name: "Win on Kong", value: 10},
    ROBBING_A_KONG: {name: "Robbing a Kong", value: 10},
    BLESSING_OF_HEAVEN: {name: "Blessing of Heaven", value: 155},
    BLESSING_OF_EARTH: {name: "Blessing of Earth", value: 155},
    THIRTEEN_TERMINALS: {name: "Thirteen Orphans", value: 160},
    SEVEN_PAIRS: {name: "Seven Pairs", value: 30}
})


// Returns:
//  null if the hand is not complete
//  a list of yaku otherwise (zero-length if chicken hand)
export function scoreHand(hand: mjtiles.Tile[]) {
    // @XXX@ This algorithm does not always handle ambiguous melds correctly.
    // @XXX@ No 13 Orphans
    hand = mjtiles.sorted(hand)
    const group_result = handleGroup(hand)
    if (!group_result) {
        // Incomplete hand
        return null
    }
    let yaku_list = [Yaku.CONCEALED_HAND]
    if (group_result.pairs === 7) {
        // Seven-pair hand
        yaku_list.push(Yaku.SEVEN_PAIRS)
    } else if (group_result.pairs !== 1
               || group_result.triplets + group_result.runs !== 4) {
        // Incomplete hand
        return null
    }
    return yaku_list
}


export function hasYaku(yaku_list: any[], what: any) {
    return _.findIndex(yaku_list, (x) => x.name === what.name) !== -1
}


class GroupResult {
    triplets = 0
    runs = 0
    pairs = 0
}


// @XXX@ forces only one interpretation of the group
// Some groups are ambiguous, like 11123444 (is it 111 234 44, or 11 123 444?)
function handleGroup(group: mjtiles.Tile[]): GroupResult | null {
    let result = new GroupResult()
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
    const group_minus_run = extractRun(group)
    if (group_minus_run) {
        ++result.runs
        return sumGroupResults(result, handleGroup(group_minus_run))
    }
    return null
}


function sumGroupResults(group1: GroupResult | null, group2: GroupResult | null) {
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
function countFirstElement(group: mjtiles.Tile[]) {
    return _.takeWhile(group, (x) => _.isEqual(x, group[0])).length
}


// If the group starts with a run, returns the group minus the run
// If the group does not start with a run, returns null
// (Note that e.g. 12223 "starts with a run" for our purposes)
function extractRun(group: mjtiles.Tile[]) {
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
