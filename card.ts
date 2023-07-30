/* Card.ts
  * Represents a single card in a deck of cards.
  * The card is represented as a 32-bit integer.
*/

export class Card {
  // Static Properties
  static STR_RANKS = "23456789TJQKA";
  static INT_RANKS: number[] = Array.from({ length: 13 }, (_, i) => i);
  static PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
  static INT_SUIT_TO_CHAR_SUIT = "xshxdxxxc";

  // Static Maps
  static CHAR_RANK_TO_INT_RANK: RankMap = new Map(
    Array.from(Card.STR_RANKS, (char, index) => [char, index]),
  );
  static CHAR_SUIT_TO_INT_SUIT: SuitMap = {
    s: 1, // spades
    h: 2, // hearts
    d: 4, // diamonds
    c: 8, // clubs
  };
  static PRETTY_SUITS: PrettySuitsMap = {
    1: "♠",
    2: "♥",
    4: "♦",
    8: "♣",
  };

  // Instance Properties
  public card_int: number = 0;

  constructor(arg: string | number) {
    if (typeof arg === "string") {
      return Card.from_string(arg);
    }

    this.card_int = arg as number;
  }

  static from_string(string: string): Card {
    const rankChar = string[0];
    const suitChar = string[1];
    const rankInt: number | undefined = Card.CHAR_RANK_TO_INT_RANK.get(
      rankChar,
    );
    const suitInt = Card.CHAR_SUIT_TO_INT_SUIT[suitChar];
    const rankPrime = Card.PRIMES[rankInt!];

    const bitrank = 1 << rankInt! << 16;
    const suit = suitInt << 12;
    const rank = rankInt! << 8;

    const cardInt = bitrank | suit | rank | rankPrime;

    return Card.from_int(cardInt);
  }

  static from_int(cardInt: number): Card {
    return Object.assign(new Card(0), { card_int: cardInt });
  }

  toString(): string {
    return Card.STR_RANKS[this.rank] + Card.INT_SUIT_TO_CHAR_SUIT[this.suit];
  }

  repr(): string {
    return `Card("${this.toString()}")`;
  }

  // Getters
  get rank(): number {
    return (this.card_int >> 8) & 0xf;
  }

  get suit(): number {
    return (this.card_int >> 12) & 0xf;
  }

  get bitrank(): number {
    return (this.card_int >> 16) & 0x1fff;
  }

  get prime(): number {
    return this.card_int & 0x3f;
  }

  get pretty_string(): string {
    return `[ ${Card.STR_RANKS[this.rank]} ${Card.PRETTY_SUITS[this.suit]} ]`;
  }

  get binary_string(): string {
    const bstr: string[] = this.card_int.toString(2).split("").reverse();
    const output: string[] = Array.from(
      { length: 33 },
      (_, i) => (i % 5 === 0 ? "\t" : "0"),
    );

    for (let i = 0; i < bstr.length; i++) {
      output[i + Math.floor(i / 4)] = bstr[i];
    }

    output.reverse();
    return output.join("");
  }
}

// Helper functions
export function card_strings_to_int(card_strs: string[]): Card[] {
  return card_strs.map((card_str) => new Card(card_str));
}

export function prime_product_from_hand(cards: Card[]): number {
  return cards.reduce((product, card) => product * card.prime, 1);
}

export function prime_product_from_rankbits(rankbits: number): number {
  let product = 1;

  for (let i = 0; i < Card.INT_RANKS.length; i++) {
    if (rankbits & (1 << i)) {
      product *= Card.PRIMES[i];
    }
  }

  return product;
}

export function card_list_to_pretty_str(cards: Card[]): string {
  return cards.map((card) => card.pretty_string).join(" ");
}

// Type definitions

type RankMap = Map<string, number>;

interface SuitMap {
  [key: string]: number;
}

interface PrettySuitsMap {
  [key: number]: string;
}
