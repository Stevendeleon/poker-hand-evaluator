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

  public cardIntValue = 0;

  /**
   * Constructs a new instance of the `Card` class.
   * @param arg {string} A string representing a card.
   * @example const card = new Card("As");
   */
  constructor(arg: string) {
    const int = Card.fromString(arg);
    this.cardIntValue = int;
  }

  /**
   * Creates a new instance of the `Card` class from a string.
   * @param {string} c A string representing a card.
   * @returns A new instance of the `Card` class.
   * @example const card = Card.fromString("As");
   */
  static fromString(c: string): number {
    if (c.length !== 2 || !Card.STR_RANKS.includes(c[0]) || !"shdc".includes(c[1])) {
      throw new Error("Invalid card string.");
    }

    const rankChar = c[0];
    const suitChar = c[1];
    const rankInt: number | undefined = Card.CHAR_RANK_TO_INT_RANK.get(rankChar);
    const suitInt = Card.CHAR_SUIT_TO_INT_SUIT[suitChar];
    const rankPrime = Card.PRIMES[rankInt!];

    const bitrank = 1 << rankInt! << 16;
    const suit = suitInt << 12;
    const rank = rankInt! << 8;

    const cardInt = bitrank | suit | rank | rankPrime;

    return cardInt;
  }

  /**
   * Returns a string representation of the card.
   * @returns A string representation of the card.
   * @public
   * @example const card = new Card("As");
   * card.asString(); // "As"
   */
  public asString(): string {
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
    return `Card("${this.asString()}")`;
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
    return (this.cardIntValue >> 8) & 0xf;
  }

  /**
   * Returns the suit of the card.
   * @returns {number} The suit of the card.
   * @public
   * @example const card = new Card("As");
   * card.suit; // 1 (spades)
   */
  get suit(): number {
    return (this.cardIntValue >> 12) & 0xf;
  }

  /**
   * Returns the bitrank of the card.
   * @returns {number} The bitrank of the card.
   * @public
   * @example const card = new Card("As");
   * card.bitrank; // 0x200000
   */
  get bitrank(): number {
    return (this.cardIntValue >> 16) & 0x1fff;
  }

  /**
   * Returns the prime of the card.
   * @returns {number} The prime of the card.
   * @public
   * @example const card = new Card("As");
   * card.prime; // 41
   */
  get prime(): number {
    return this.cardIntValue & 0x3f;
  }

  /**
   * Returns the string representation of the card in a pretty format.
   * @returns {string} The string representation of the card in a pretty format.
   * @public
   * @example const card = new Card("As");
   * card.prettify; // "[ A ♠ ]"
   */
  get prettify(): string {
    return `[ ${Card.STR_RANKS[this.rank]} ${Card.PRETTY_SUITS[this.suit]} ]`;
  }

  /**
   * Returns the binary string representation of the card.
   * @returns {string} The binary string representation of the card.
   * @public
   * @example const card = new Card("As");
   * card.binaryString; // "10000000000000000001011000001001001"
   */
  get binaryString(): string {
    const bstr: string[] = this.cardIntValue.toString(2).split("").reverse();
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
 * @param {string[]} cards A list of card strings.
 * @returns {Card[]} A list of cards.
 * @public
 * @example const cards = cardStringsToInt(["As", "2h", "Td", "Jc"]);
 * cards; // [ Card("As"), Card("2h"), Card("Td"), Card("Jc") ]
 */
export function cardStringsToInt(cards: string[]): Card[] {
  return cards.map((card) => new Card(card));
}

/**
 * Returns a prime product from a list of cards.
 * @param {Card[]} cards A list of cards.
 * @returns {number} A prime product.
 * @public
 * @example const cards = primeProductFromHands(["As", "2h", "Td", "Jc"]);
 * cards; // 54694
 */
export function primeProductFromHands(cards: Card[]): number {
  return cards.reduce((product, card) => product * card.prime, 1);
}

/**
 * Returns a prime product from a rankbits.
 * @param {number} rankbits A rankbits.
 * @returns {number} A prime product.
 * @public
 * @example const rankbits = 0b0000000;
 * primeProductFromRankbits(rankbits); // 1
 */
export function primeProductFromRankbits(rankbits: number): number {
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
 * @example const cards = prettifyListOfCards(["As", "2h", "Td", "Jc"]);
 * cards; // "[ A ♠ ] [ 2 ♥ ] [ T ♦ ] [ J ♣ ]"
 */
export function prettifyListOfCards(cards: Card[]): string {
  return cards.map((card) => card.prettify).join(" ");
}
