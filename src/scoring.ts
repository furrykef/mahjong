import * as _ from 'lodash'

import * as mjtiles from './mjtiles'
import * as mjset from './mjset'


export interface Yaku {
    readonly name: string
    readonly value: number
}

// NB: Every yaku's name must be unique.
export const YakuType = Object.freeze({
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

const ORPHANS_PATTERN = mjtiles.sorted(mjtiles.convStringToTiles("19b 19c 19d ESWN HGR"))


// Returns:
//  null if the hand is not complete
//  a list of yaku otherwise (zero-length if chicken hand)
export function scoreHand(hand: mjtiles.Tile[]) {
    hand = mjtiles.sorted(hand)
    if (_.isEqual(_.uniqWith(hand, _.isEqual), ORPHANS_PATTERN)) {
        return [YakuType.THIRTEEN_TERMINALS, YakuType.CONCEALED_HAND]
    }
    return scoreHandImpl(hand, [])
}


export function scoreYaku(yaku_list: Yaku[]) {
    // @TODO@ clamp at 320 unless there's a yaku with a larger listed value
    return _.sumBy(yaku_list, (x) => x.value)
}


export function hasYaku(yaku_list: Yaku[], what: Yaku) {
    return yaku_list.some((x) => x.name === what.name)
}


export function compareYaku(yaku_list1: Yaku[], yaku_list2: Yaku[]) {
    return _.isEqual(_.sortBy(yaku_list1, ['name']),
                     _.sortBy(yaku_list2, ['name']))
}


// If the list contains limit yaku, return only the highest limit yaku.
// Otherwise, return the yaku list unchanged (except possibly for ordering).
function simplifyYaku(yaku_list: Yaku[] | null) {
    if (yaku_list && yaku_list.length > 0) {
        yaku_list = _.orderBy(yaku_list, ['value'], ['desc'])
        if (yaku_list[0].value >= 320) {
            return [yaku_list[0]]
        }
    }
    return yaku_list
}


function scoreHandImpl(tiles: mjtiles.Tile[], sets: mjset.Set[]): Yaku[] | null {
    if (tiles.length === 0) {
        // Terminate recursion
        return scoreSets(sets)
    }
    let best_yaku = null
    let best_yaku_score = -1
    const num_first = countFirstElement(tiles)
    if (num_first >= 3) {
        // This might be a triplet (or triplet plus one, as in 111123),
        // but might not (as in 11123)
        const set = new mjset.Set(tiles.slice(0, 3), true)
        const yaku = scoreHandImpl(tiles.slice(3), sets.concat([set]))
        if (yaku) {
            const score = scoreYaku(yaku)
            if (score > best_yaku_score) {
                best_yaku = yaku
                best_yaku_score = score
            }
        }
    }
    if (num_first >= 2) {
        // This might be a pair (either eyes or for Seven Pairs),
        // but it might not (as in 112233, i.e., 123123)
        const set = new mjset.Set(tiles.slice(0, 2), true)
        const yaku = scoreHandImpl(tiles.slice(2), sets.concat([set]))
        if (yaku) {
            const score = scoreYaku(yaku)
            if (score > best_yaku_score) {
                best_yaku = yaku
                best_yaku_score = score
            }
        }
    }
    // This might be the start of a run
    const extraction_result = extractRun(tiles)
    if (extraction_result) {
        const yaku = scoreHandImpl(extraction_result.sansRun, sets.concat([extraction_result.run]))
        if (yaku) {
            const score = scoreYaku(yaku)
            if (score > best_yaku_score) {
                best_yaku = yaku
                best_yaku_score = score
            }
        }
    }
    return best_yaku
}


function scoreSets(sets: mjset.Set[]) {
    let yaku_list = [YakuType.CONCEALED_HAND]

    let num_triplets = 0
    let num_runs = 0
    let num_pairs = 0
    let num_dragon_triplets = 0
    let has_dragon_pair = false
    let num_wind_triplets = 0
    let has_wind_pair = false
    let num_sets_with_terms_or_honors = 0
    for (const set of sets) {
        if (set.isTriplet) {
            ++num_triplets
            if (set.suit === mjtiles.Suit.DRAGONS) {
                ++num_dragon_triplets
                switch (set.tiles[0].rank) {
                    case mjtiles.Dragon.WHITE: yaku_list.push(YakuType.VALUE_HONOR_WHITE); break
                    case mjtiles.Dragon.GREEN: yaku_list.push(YakuType.VALUE_HONOR_GREEN); break
                    case mjtiles.Dragon.RED: yaku_list.push(YakuType.VALUE_HONOR_RED); break
                    default: throw Error("Impossible honor tile in scoreSets")
                }
            } else if (set.suit === mjtiles.Suit.WINDS) {
                ++num_wind_triplets
            }
        } else if (set.isRun) {
            ++num_runs
        } else if (set.isPair) {
            ++num_pairs
            if (set.suit === mjtiles.Suit.DRAGONS) {
                has_dragon_pair = true
            } else if (set.suit === mjtiles.Suit.WINDS) {
                has_wind_pair = true
            }
        } else {
            throw new Error("Invalid set in scoreSets")
        }

        if (set.tiles.some((x) => x.isHonor || x.isTerminal)) {
            ++num_sets_with_terms_or_honors
        }
    }

    if (num_triplets + num_runs === 4 && num_pairs === 1) {
        // We have a complete, regular hand
        if (num_triplets === 4) {
            yaku_list.push(YakuType.ALL_TRIPLETS)
        }
        if (num_dragon_triplets === 3) {
            yaku_list.push(YakuType.BIG_THREE_DRAGONS)
        } else if (num_dragon_triplets === 2 && has_dragon_pair) {
            yaku_list.push(YakuType.SMALL_THREE_DRAGONS)
        }
        if (num_wind_triplets === 4) {
            yaku_list.push(YakuType.BIG_FOUR_WINDS)
        } else if (num_wind_triplets === 3) {
            if (has_wind_pair) {
                yaku_list.push(YakuType.SMALL_FOUR_WINDS)
            } else {
                yaku_list.push(YakuType.BIG_THREE_WINDS)
            }
        } else if (num_wind_triplets === 2 && has_wind_pair) {
            yaku_list.push(YakuType.SMALL_THREE_WINDS)
        }
        if (num_runs === 4) {
            yaku_list.push(YakuType.ALL_SEQUENCES)
        }
        yaku_list = yaku_list.concat(detectSimilarSets(sets))
    } else if (num_pairs === 7) {
        yaku_list.push(YakuType.SEVEN_PAIRS)
    } else {
        // Incomplete hand
        return null
    }

    // If we get here, the hand is known to be complete
    const all_tiles = _.flatten(sets.map((x) => x.tiles))
    const honors = all_tiles.filter((x) => x.isHonor)
    const numbers = all_tiles.filter((x) => x.isNumber)
    const terminals = numbers.filter((x) => x.isTerminal)
    const suited = numbers.length > 0 && numbers.every((x) => x.suit === numbers[0].suit)

    if (numbers.length - terminals.length === all_tiles.length) {
        yaku_list.push(YakuType.NO_TERMINALS)
    } else if (honors.length === all_tiles.length) {
        yaku_list.push(YakuType.ALL_HONORS)
    } else if (terminals.length + honors.length === all_tiles.length) {
        if (honors.length === 0) {
            yaku_list.push(YakuType.PURE_GREATER_TERMINALS)
        } else {
            yaku_list.push(YakuType.MIXED_GREATER_TERMINALS)
        }
    } else if (num_sets_with_terms_or_honors === sets.length) {
        if (honors.length === 0) {
            yaku_list.push(YakuType.PURE_LESSER_TERMINALS)
        } else {
            yaku_list.push(YakuType.MIXED_LESSER_TERMINALS)
        }
    }

    if (suited) {
        yaku_list.push((honors.length > 0) ? YakuType.MIXED_ONE_SUIT : YakuType.PURE_ONE_SUIT)
    }

    return simplifyYaku(yaku_list)
}


// Detects yaku in sections 5, 6, and 7 of the Zung Jung yaku list
// (in other words, the most annoying ones to detect!)
function detectSimilarSets(sets: mjset.Set[]) {
    let yaku_list: Yaku[] = []

    let runs = sets.filter((x) => x.isRun)

    // Detect identical sets
    // @TODO@ using toString is pretty hacky
    let counted_runs = _.countBy(runs, (x) => x.tiles[0].toString())
    let num_double_runs = 0
    for (const num of Object.values(counted_runs)) {
        if (num === 2) {
            ++num_double_runs
        } else if (num === 3) {
            yaku_list.push(YakuType.THREE_IDENTICAL_SEQUENCES)
        } else if (num === 4) {
            yaku_list.push(YakuType.FOUR_IDENTICAL_SEQUENCES)
        }
    }
    if (num_double_runs === 1) {
        yaku_list.push(YakuType.TWO_IDENTICAL_SEQUENCES)
    } else if (num_double_runs === 2) {
        yaku_list.push(YakuType.TWO_IDENTICAL_SEQUENCES_TWICE)
    }

    return yaku_list
}


// Assuming the group is sorted, counts the number of copies of the
// first element in the group
function countFirstElement(group: mjtiles.Tile[]) {
    return _.takeWhile(group, (x) => x.equals(group[0])).length
}


// If tiles does not start with a run, returns null
// (Note that e.g. 12223 "starts with a run" for our purposes)
function extractRun(tiles: mjtiles.Tile[]) {
    const first = tiles[0]
    if (first.isHonor) {
        // Can't have runs of honor tiles
        return null
    }
    const second = new mjtiles.Tile(first.suit, first.rank+1)
    const third = new mjtiles.Tile(first.suit, first.rank+2)
    let run = [tiles[0]]
    tiles = tiles.slice(1)
    const second_idx = _.findIndex(tiles, second)
    if (second_idx === -1) {
        return null
    }
    run.push(tiles.splice(second_idx, 1)[0])
    const third_idx = _.findIndex(tiles, third)
    if (third_idx === -1) {
        return null
    }
    run.push(tiles.splice(third_idx, 1)[0])
    return {run: new mjset.Set(run, true),
            sansRun: tiles}
}
