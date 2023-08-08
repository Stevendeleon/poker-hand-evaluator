/**
 * Evaluates hand strengths with optimizations in terms of speed and memory usage.
 */
import {
  Card,
  primeProductFromHands,
  primeProductFromRankbits,
} from "@/card.ts";
import { LOOKUP_TABLE } from "@/hand_lookup.ts";
import { combinations } from "@/utils.ts";

interface Player {
  cards: Card[];
}

function _five(cards: Card[]): number {
  if (
    cards[0].cardIntValue & cards[1].cardIntValue & cards[2].cardIntValue &
    cards[3].cardIntValue & cards[4].cardIntValue & 0xF000
  ) {
    const hand_or =
      (cards[0].cardIntValue | cards[1].cardIntValue | cards[2].cardIntValue |
        cards[3].cardIntValue | cards[4].cardIntValue) >> 16;
    const prime = primeProductFromRankbits(hand_or);
    return LOOKUP_TABLE.flush_lookup[prime];
  }

  const prime = primeProductFromHands(cards);
  return LOOKUP_TABLE.unsuited_lookup[prime];
}

export function evaluate(cards: Card[], board: Card[]): number {
  const allCards = [...cards, ...board];
  const combos = combinations(allCards, 5);
  return Math.min(...combos.map((hand: Card[]) => _five(hand)));
}

export function findWinner(players: Player[], board: Card[]): Player[] {
  let winners: Player[] = [];
  let winningRank = LOOKUP_TABLE.MAX_HIGH_CARD;

  for (const player of players) {
    const possibleHands = combinations([...player.cards, ...board], 5);

    for (const hand of possibleHands) {
      const rank = evaluate(hand, board);

      if (rank < winningRank) {
        winningRank = rank;
        winners = [player];
      } else if (rank === winningRank) {
        winners.push(player);
      }
    }
  }

  return winners;
}

export function getRankClass(handRank: number): number {
  const maxToRankClass = LOOKUP_TABLE.MAX_TO_RANK_CLASS;
  const maxRanks = Object.keys(maxToRankClass).map((key) => parseInt(key));
  const maxRank = Math.max(...maxRanks.filter((rank) => rank <= handRank));
  return maxToRankClass[maxRank];
}

export function rankToString(hand_rank: number): string {
  return LOOKUP_TABLE.RANK_CLASS_TO_STRING[getRankClass(hand_rank)];
}

export function getPercentageFromFiveCardRank(hand_rank: number): number {
  return 1 - hand_rank / LOOKUP_TABLE.MAX_HIGH_CARD;
}

// export function isStraight(cards: Card[]): boolean {
//     const ranks = cards.map((card) => card.rank);
//     const minRank = Math.min(...ranks);
//     const maxRank = Math.max(...ranks);
//     return maxRank - minRank === 4 && new Set(ranks).size === 5;
// }

// export function isStraightFlush(cards: Card[]): boolean {
//     return isFlush(cards) && isStraight(cards);
// }

// export function isRoyalFlush(cards: Card[]): boolean {
//     return isStraightFlush(cards) && cards[0].rank === 10;
// }

// export function isFourOfAKind(cards: Card[]): boolean {
//   const ranks = cards.map((card) => card.rank);
//   const rankCounts = getRankCounts(ranks);
//   return Object.values(rankCounts).includes(4);
// }

// function getRankCounts(ranks: number[]): Record<number, number> {
//   const rankCounts: Record<number, number> = {};
//   ranks.forEach(rank => {
//       if (rankCounts[rank]) {
//           rankCounts[rank]++;
//       } else {
//           rankCounts[rank] = 1;
//       }
//   });
//   return rankCounts;
// }
