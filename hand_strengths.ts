import { Card } from "@/card.ts";
import { combinations } from "@/utils.ts";

type NumberMap = { [key: number]: number };

/**
 * @class HandStrength
 * @classdesc A class for calculating the strength of a poker hand.
 */
export class HandStrength {
  /**
   * The maximum rank of a Straight Flush hand.
   */
  public readonly MAX_STRAIGHT_FLUSH = 10;

  /**
   * The maximum rank of a Four of a Kind hand.
   */
  public readonly MAX_FOUR_OF_A_KIND = 166;

  /**
   * The maximum rank of a Full House hand.
   */
  public readonly MAX_FULL_HOUSE = 322;

  /**
   * The maximum rank of a Flush hand.
   */
  public readonly MAX_FLUSH = 1599;

  /**
   * The maximum rank of a Straight hand.
   */
  public readonly MAX_STRAIGHT = 1609;

  /**
   * The maximum rank of a Three of a Kind hand.
   */
  public readonly MAX_THREE_OF_A_KIND = 2467;

  /**
   * The maximum rank of a Two Pair hand.
   */
  public readonly MAX_TWO_PAIR = 3325;

  /**
   * The maximum rank of a Pair hand.
   */
  public readonly MAX_PAIR = 6185;

  /**
   * The maximum rank of a High Card hand.
   */
  public readonly MAX_HIGH_CARD = 7462;

  /**
   * A mapping from the maximum rank to the corresponding rank class.
   */
  public readonly MAX_TO_RANK_CLASS: NumberMap = {
    [this.MAX_STRAIGHT_FLUSH]: 1,
    [this.MAX_FOUR_OF_A_KIND]: 2,
    [this.MAX_FULL_HOUSE]: 3,
    [this.MAX_FLUSH]: 4,
    [this.MAX_STRAIGHT]: 5,
    [this.MAX_THREE_OF_A_KIND]: 6,
    [this.MAX_TWO_PAIR]: 7,
    [this.MAX_PAIR]: 8,
    [this.MAX_HIGH_CARD]: 9,
  };

  /**
   * A mapping from the rank class to the corresponding string representation.
   */
  public readonly RANK_CLASS_TO_STRING: { [key: number]: string } = {
    1: "Straight Flush",
    2: "Four of a Kind",
    3: "Full House",
    4: "Flush",
    5: "Straight",
    6: "Three of a Kind",
    7: "Two Pair",
    8: "Pair",
    9: "High card",
  };

  /**
   * A mapping from the prime product of a flush to its rank.
   * @private
   */
  public readonly flush_lookup: NumberMap = {};

  /**
   * A mapping from the prime product of an unsuited hand to its rank.
   * @private
   */
  public readonly unsuited_lookup: NumberMap = {};

  /**
   * @constructor
   */
  constructor() {
    this._flushes();
    this._multiples();
  }

  /**
   * Generate flush lookup table.
   * @private
   */
  private _flushes(): void {
    let rank = 1;
    const straight_flushes: number[] = [
      7936,
      3968,
      1984,
      992,
      496,
      248,
      124,
      62,
      31,
      4111,
    ];

    const flushes: number[] = [];
    const gen = this._get_lexographically_next_bit_sequence(31);

    for (let i = 0; i < 1277 + straight_flushes.length - 1; i++) {
      const flush = gen.next().value as number;

      let not_sf = true;
      for (const straight_flush of straight_flushes) {
        if ((flush ^ straight_flush) === 0) {
          not_sf = false;
          break;
        }
      }

      if (not_sf) {
        flushes.push(flush);
      }
    }

    flushes.reverse();

    for (const straight_flush of straight_flushes) {
      const prime_product = Card.prime_product_from_rankbits(straight_flush);
      this.flush_lookup[prime_product] = rank;
      rank++;
    }

    rank = this.MAX_FULL_HOUSE + 1;
    for (const flush of flushes) {
      const prime_product = Card.prime_product_from_rankbits(flush);
      this.flush_lookup[prime_product] = rank;
      rank++;
    }

    this._straight_and_highcards(straight_flushes, flushes);
  }

  /**
   * Generate unsuited lookup table for straights and high cards.
   * @private
   */
  private _straight_and_highcards(
    straights: number[],
    highcards: number[],
  ): void {
    let rank = this.MAX_FLUSH + 1;
    for (const straight of straights) {
      const prime_product = Card.prime_product_from_rankbits(straight);
      this.unsuited_lookup[prime_product] = rank;
      rank++;
    }

    rank = this.MAX_PAIR + 1;
    for (const high_card of highcards) {
      const prime_product = Card.prime_product_from_rankbits(high_card);
      this.unsuited_lookup[prime_product] = rank;
      rank++;
    }
  }

  /**
   * Generate lookup table for multiples (Four of a Kind, Three of a Kind, etc.).
   * @private
   */
  private _multiples(): void {
    const backwards_ranks = Array.from(
      { length: Card.INT_RANKS.length },
      (_, i) => Card.INT_RANKS.length - 1 - i,
    );

    let rank = this.MAX_STRAIGHT_FLUSH + 1;
    for (let i = 0; i < backwards_ranks.length; i++) {
      for (let k = 0; k < backwards_ranks.length; k++) {
        if (k !== i) {
          const product = Card.PRIMES[backwards_ranks[i]] ** 4 *
            Card.PRIMES[backwards_ranks[k]];
          this.unsuited_lookup[product] = rank;
          rank++;
        }
      }
    }

    rank = this.MAX_FOUR_OF_A_KIND + 1;
    for (let i = 0; i < backwards_ranks.length; i++) {
      for (let j = 0; j < backwards_ranks.length; j++) {
        if (j !== i) {
          const product = Card.PRIMES[backwards_ranks[i]] ** 3 *
            Card.PRIMES[backwards_ranks[j]] ** 2;
          this.unsuited_lookup[product] = rank;
          rank++;
        }
      }
    }

    rank = this.MAX_STRAIGHT + 1;
    for (const b_rank of backwards_ranks) {
      for (
        const kickers of combinations(
          backwards_ranks.filter((r) => r !== b_rank),
          2,
        )
      ) {
        const [card1, card2] = kickers;
        const product = Card.PRIMES[b_rank] ** 3 *
          Card.PRIMES[card1] *
          Card.PRIMES[card2];
        this.unsuited_lookup[product] = rank;
        rank++;
      }
    }

    rank = this.MAX_THREE_OF_A_KIND + 1;
    for (const two_pair of combinations(backwards_ranks, 2)) {
      const [pair1, pair2] = two_pair;
      for (
        const kicker of backwards_ranks.filter(
          (r) => r !== pair1 && r !== pair2,
        )
      ) {
        const product = Card.PRIMES[pair1] ** 2 * Card.PRIMES[pair2] ** 2 *
          Card.PRIMES[kicker];
        this.unsuited_lookup[product] = rank;
        rank++;
      }
    }

    rank = this.MAX_TWO_PAIR + 1;
    for (const pairrank of backwards_ranks) {
      for (
        const kickers of combinations(
          backwards_ranks.filter((r) => r !== pairrank),
          3,
        )
      ) {
        const [kicker1, kicker2, kicker3] = kickers;
        const product = Card.PRIMES[pairrank] ** 2 *
          Card.PRIMES[kicker1] *
          Card.PRIMES[kicker2] *
          Card.PRIMES[kicker3];
        this.unsuited_lookup[product] = rank;
        rank++;
      }
    }
  }

  /**
   * Generate the next lexographically bit sequence.
   * @param bits The input bits.
   * @private
   */
  private *_get_lexographically_next_bit_sequence(
    bits: number,
  ): Generator<number> {
    let xbits = (bits | (bits - 1)) + 1;
    let lexo_next = xbits | ((((xbits & -xbits) / (bits & -bits)) >> 1) - 1);
    yield lexo_next;
    while (true) {
      xbits = (lexo_next | (lexo_next - 1)) + 1;
      lexo_next = xbits |
        (((xbits & -xbits) / (lexo_next & -lexo_next)) >> 1) - 1;
      yield lexo_next;
    }
  }
}
