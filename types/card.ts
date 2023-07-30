export type RankMap = Map<string, number>;

export interface SuitMap {
  [key: string]: number;
}

export interface PrettySuitsMap {
  [key: number]: string;
}

export interface CardConstructor {
  new (arg: string | number): ICard;
}

export interface ICard {
  cardInt: number;
  toString: () => string;
  repr: () => string;
  rank: number;
  suit: number;
  bitrank: number;
  prime: number;
  pretty_string: string;
  binary_string: string;
}

export interface CardStatic extends CardConstructor {
  STR_RANKS: string;
  INT_RANKS: number[];
  PRIMES: number[];
  CHAR_RANK_TO_INT_RANK: RankMap;
  CHAR_SUIT_TO_INT_SUIT: SuitMap;
  INT_SUIT_TO_CHAR_SUIT: string;
  PRETTY_SUITS: PrettySuitsMap;
  from_string(string: string): ICard;
  from_int(cardInt: number): ICard;
}

export interface CardHelperFunctions {
  card_strings_to_int(card_strs: string[]): ICard[];
  prime_product_from_hand(cards: ICard[]): number;
  prime_product_from_rankbits(rankbits: number): number;
  card_list_to_pretty_str(cards: ICard[]): string;
}

export type CardClass = CardStatic & CardHelperFunctions;
