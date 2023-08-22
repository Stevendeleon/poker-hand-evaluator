/**
 * Represents a card rank mapping where each card rank is associated with a numeric value.
 * @typedef {Map<string, number>} CardRankMapping
 */
type CardRankMapping = Map<string, number>;

/**
 * Represents a mapping of card suits to their corresponding numeric values.
 * @interface
 */
interface CardSuitMapping {
  [key: string]: number;
}

/**
 * @class
 * @description Represents a card.
 *
 * @note PlayingCard class represents a card with a rank and suit. Each card is associated
 * with a unique integer value. This class also provides methods to retrieve the rank and suit
 * of the card and their binary representations.
 * @example const card = new PlayingCard("As");
 */
export class PlayingCard {
  /**
   * Represents a string containing the ranks of playing cards.
   *
   * @constant
   * @type {string}
   */
  static RANK_STRINGS = "23456789TJQKA";
  /**
   * Represents the possible rank values for a set of cards.
   * The RANK_VALUES variable is an array of numbers from 0 to 12, inclusive.
   * Each number represents a specific rank value for a card.
   *
   * @type {number[]}
   */
  static RANK_VALUES: number[] = Array.from({ length: 13 }, (_, i) => i);
  /**
   * Represents a constant array of prime numbers.
   *
   * @const
   * @type {number[]}
   * @desc This variable stores an array of prime numbers from 2 to 41, inclusive.
   *       Prime numbers are integers greater than 1 that have no positive divisors
   *       other than 1 and themselves.
   */
  static PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
  /**
   * A mapping variable that maps integer values to corresponding character values for a specific suit.
   * The mapping values are in the form of a string.
   *
   * @type {string}
   */
  static SUIT_INT_TO_CHAR_MAPPING = "xshxdxxxc";
  /**
   * A mapping between rank characters and their corresponding integer values.
   *
   * @type {CardRankMapping}
   */
  static RANK_CHAR_TO_INT_MAPPING: CardRankMapping = new Map(
    Array.from(PlayingCard.RANK_STRINGS, (char, index) => [char, index]),
  );
  /**
   * Represents a mapping of suit characters to integer values.
   * @typedef {Object} CardSuitMapping
   * @property {number} s - The integer value representing the spades suit ('s').
   * @property {number} h - The integer value representing the hearts suit ('h').
   * @property {number} d - The integer value representing the diamonds suit ('d').
   * @property {number} c - The integer value representing the clubs suit ('c').
   */
  static SUIT_CHAR_TO_INT_MAPPING: CardSuitMapping = {
    s: 1, // spades
    h: 2, // hearts
    d: 4, // diamonds
    c: 8, // clubs
  };

  /**
   * Represents the integer value of a card.
   *
   * @type {number}
   */
  public intValueOfCard = 0;

  /**
   * Constructs a new instance of the class.
   *
   * @param {string} arg - The string representation of the playing card.
   *
   * @return {void}
   */
  constructor(arg: string) {
    this.intValueOfCard = PlayingCard.fromString(arg);
  }

  /**
   * Converts a string representation of a card to its corresponding integer value.
   * @param {string} c - The string representation of the card.
   * @throws {Error} If the string has an invalid length, rank character, or suit character.
   * @returns {number} The integer value of the card.
   */
  static fromString(c: string): number {
    if (c.length !== 2) throw new Error("Invalid card string length");

    const rankCharacter = c[0];
    const suitCharacter = c[1];

    if (!PlayingCard.RANK_CHAR_TO_INT_MAPPING.has(rankCharacter)) {
      throw new Error("Invalid rank character");
    }
    if (!(suitCharacter in PlayingCard.SUIT_CHAR_TO_INT_MAPPING)) {
      throw new Error("Invalid suit character");
    }

    const integerValueOfRank: number | undefined = PlayingCard
      .RANK_CHAR_TO_INT_MAPPING.get(rankCharacter);
    const integerValueOfSuit =
      PlayingCard.SUIT_CHAR_TO_INT_MAPPING[suitCharacter];
    const primeNumberOfRank = PlayingCard.PRIME_NUMBERS[integerValueOfRank!];

    const binaryValueOfRank = 1 << integerValueOfRank! << 16;
    const suit = integerValueOfSuit << 12;
    const rank = integerValueOfRank! << 8;

    const integerValueOfCard = binaryValueOfRank | suit | rank |
      primeNumberOfRank;

    return integerValueOfCard;
  }

  /**
   * Retrieves the rank of a card.
   *
   * @returns {number} The rank of the card.
   * @example const card = new PlayingCard("As"); // 0x0001b1
   */
  get rank(): number {
    return (this.intValueOfCard >> 8) & 0xf;
  }

  /**
   * Retrieves the suit of a card.
   *
   * @returns {number} The suit of the card.
   */
  get suit(): number {
    return (this.intValueOfCard >> 12) & 0xf;
  }

  /**
   * Returns a string representation of the playing card.
   *
   * @returns {string} The string representation of the playing card.
   */
  get output(): string {
    return PlayingCard.RANK_STRINGS[this.rank] +
      PlayingCard.SUIT_INT_TO_CHAR_MAPPING[this.suit];
  }

  /**
   * Returns a string representation of the object.
   *
   * @return {string} The string representation of the object.
   */
  get repr(): string {
    return `PlayingCard(${this.output})`;
  }

  /**
   * Retrieves the binary rank value of a card.
   *
   * @returns {number} The binary rank value of the card.
   */
  get binaryRankValue(): number {
    return (this.intValueOfCard >> 16) & 0x1fff;
  }

  /**
   * Returns the prime number associated with the current object.
   *
   * @returns {number} The prime number.
   */
  get primeNumber(): number {
    return this.intValueOfCard & 0x3f;
  }

  get binaryStringValue(): string {
    const reversedBinaryString: string[] = this.intValueOfCard.toString(2)
      .split("").reverse();
    const output: string[] = Array.from(
      { length: 33 },
      (_, i) => (i % 5 === 0 ? "\t" : "0"),
    );

    for (let i = 0; i < reversedBinaryString.length; i++) {
      output[i + Math.floor(i / 4)] = reversedBinaryString[i];
    }

    output.reverse();
    return output.join("");
  }
}

export function convertCardStringsToPlayingCards(
  cards: string[],
): PlayingCard[] {
  return cards.map((card) => new PlayingCard(card));
}

export function getPrimeProductFromCards(cards: PlayingCard[]): number {
  return cards.reduce((product, card) => product * card.primeNumber, 1);
}

export function prime_product_from_rankbits(rankbits: number): number {
=======
export function getPrimeProductFromRankbits(rankBits: number): number {
>>>>>>> 53cbd75410de914734c7e3c6d62a98e1014f5308
  let product = 1;

  for (let i = 0; i < PlayingCard.RANK_VALUES.length; i++) {
    if (rankBits & (1 << i)) {
      product *= PlayingCard.PRIME_NUMBERS[i];
    }
  }

  return product;
}
<<<<<<< HEAD

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
=======
>>>>>>> 53cbd75410de914734c7e3c6d62a98e1014f5308
