// Type definitions
type RankMap = Map<string, number>;

interface SuitMap {
  [key: string]: number;
}

interface PrettySuitsMap {
  [key: number]: string;
}


/**
 * Card class
 * @class Card
 * @classdesc Represents a single playing card in a standard deck of 52 cards.
 * @note This class uses the 32-bit integer representation of a card.
 * @example const card = new Card("As");
 */
export class Card {
  static STR_RANKS = "23456789TJQKA";
  static INT_RANKS: number[] = Array.from({ length: 13 }, (_, i) => i);
  static PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
  static INT_SUIT_TO_CHAR_SUIT = "xshxdxxxc";
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

  public card_int: number = 0;

  /**
   * Constructs a new instance of the `Card` class.
   * @param arg Either a string or an integer representing a card.
   * @example const card = new Card("As");
   * @example const card = new Card(0x200000);
   */
  constructor(arg: string | number) {
    if (typeof arg === "string") {
      return Card.from_string(arg);
    }

    this.card_int = arg as number;
  }

  /**
   * Creates a new instance of the `Card` class from a string.
   * @param {string} c A string representing a card.
   * @returns A new instance of the `Card` class.
   * @example const card = Card.from_string("As");
   */
  static from_string(c: string): Card {
    const rankChar = c[0];
    const suitChar = c[1];
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

  /**
   * Creates a new instance of the `Card` class from an integer.
   * @param {number} c An integer representing a card.
   * @returns A new instance of the `Card` class.
   * @example const card = Card.from_int(0x200000);
   */
  static from_int(c: number): Card {
    return Object.assign(new Card(0), { card_int: c });
  }

  /**
   * Returns a string representation of the card.
   * @returns A string representation of the card.
   * @public
   * @example const card = new Card("As");
   * card.toString(); // "As"
   */
  public toString(): string {
    return Card.STR_RANKS[this.rank] + Card.INT_SUIT_TO_CHAR_SUIT[this.suit];
  }

  /**
   * Returns a representation of the card.
   * @returns A string representation of the card.
   * @public
   * @example const card = new Card("As");
   * card.repr(); // "Card("As")"
   */
  public repr(): string {
    return `Card("${this.toString()}")`;
  }

  // Getters
  // -------

  /**
   * Returns the rank of the card.
   * @returns {number} The rank of the card.
   * @public
   * @example const card = new Card("As");
   * card.rank; // 12
   */
  get rank(): number {
    return (this.card_int >> 8) & 0xf;
  }

  /**
   * Returns the suit of the card.
   * @returns {number} The suit of the card.
   * @public
   * @example const card = new Card("As");
   * card.suit; // 1 (spades)
   */
  get suit(): number {
    return (this.card_int >> 12) & 0xf;
  }

  /**
   * Returns the bitrank of the card.
   * @returns {number} The bitrank of the card.
   * @public
   * @example const card = new Card("As");
   * card.bitrank; // 0x200000
   */
  get bitrank(): number {
    return (this.card_int >> 16) & 0x1fff;
  }

  /**
   * Returns the prime of the card.
   * @returns {number} The prime of the card.
   * @public
   * @example const card = new Card("As");
   * card.prime; // 41
   */
  get prime(): number {
    return this.card_int & 0x3f;
  }

  /**
   * Returns the string representation of the card in a pretty format.
   * @returns {string} The string representation of the card in a pretty format.
   * @public
   * @example const card = new Card("As");
   * card.pretty_string; // "[ A ♠ ]"
   */
  get pretty_string(): string {
    return `[ ${Card.STR_RANKS[this.rank]} ${Card.PRETTY_SUITS[this.suit]} ]`;
  }

  /**
   * Returns the binary string representation of the card.
   * @returns {string} The binary string representation of the card.
   * @public
   * @example const card = new Card("As");
   * card.binary_string; // "10000000000000000001011000001001001"
   */
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
// ---------------

/**
 * Returns a list of cards from a list of card strings.
 * @param {string[]} card_strs A list of card strings.
 * @returns {Card[]} A list of cards.
 * @public
 * @example const cards = card_strings_to_int(["As", "2h", "Td", "Jc"]);
 * cards; // [ Card("As"), Card("2h"), Card("Td"), Card("Jc") ]
 */
export function card_strings_to_int(card_strs: string[]): Card[] {
  return card_strs.map((card_str) => new Card(card_str));
}

/**
 * Returns a prime product from a list of cards.
 * @param {Card[]} cards A list of cards.
 * @returns {number} A prime product.
 * @public
 * @example const cards = card_strings_to_int(["As", "2h", "Td", "Jc"]);
 * prime_product_from_hand(cards); // 54694
 */
export function prime_product_from_hand(cards: Card[]): number {
  return cards.reduce((product, card) => product * card.prime, 1);
}

/**
 * Returns a prime product from a rankbits.
 * @param {number} rankbits A rankbits.
 * @returns {number} A prime product.
 * @public
 * @example const rankbits = 0b0000000;
 * prime_product_from_rankbits(rankbits); // 1
 */
export function prime_product_from_rankbits(rankbits: number): number {
  let product = 1;

  for (let i = 0; i < Card.INT_RANKS.length; i++) {
    if (rankbits & (1 << i)) {
      product *= Card.PRIMES[i];
    }
  }

  return product;
}

/**
 * Returns a string of cards in pretty format from a list of cards.
 * @param {Card[]} cards A list of cards.
 * @returns {string} A string of cards in pretty format.
 * @public
 * @example const cards = card_strings_to_int(["As", "2h", "Td", "Jc"]);
 * card_list_to_pretty_str(cards); // "[ A ♠ ] [ 2 ♥ ] [ T ♦ ] [ J ♣ ]"
 */
export function card_list_to_pretty_str(cards: Card[]): string {
  return cards.map((card) => card.pretty_string).join(" ");
}

