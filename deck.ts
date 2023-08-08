import { Card } from "@/card.ts";

/**
 * Represents a standard deck of playing cards.
 */
export class Deck {
  /**
   * The array containing all the cards in the deck.
   */
  public cards: Card[] = [];

  /**
   * Constructs a new instance of the `Deck` class with 52 cards.
   * @constructor
   */
  constructor() {
    this.cards = this.create() as Card[];
  }

  /**
   * Creates a new deck of cards with 52 cards.
   * @returns An array containing all the cards in the deck.
   * @private
   */
  private create(): Card[] {
    return Array.from({ length: 52 }, (_, i) => new Card(i));
  }

  /**
   * Shuffles the deck of cards randomly.
   */
  public shuffle(): void {
    const { cards } = this;

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  /**
   * Deals cards to the specified number of players.
   * @param players The number of players to deal cards to.
   * @returns An array of arrays containing cards dealt to each player.
   */
  public deal(players: number): Card[][] {
    return Array.from({ length: players }, (_) => this.draw(2));
  }

  /**
   * Returns the number of cards remaining in the deck.
   * @returns The number of cards remaining in the deck.
   */
  public remaining(): number {
    return this.cards.length;
  }

  /**
   * Draws a specified number of cards from the deck.
   * @param n The number of cards to draw.
   * @returns An array of cards drawn from the deck.
   * @private
   */
  private draw(n: number): Card[] {
    return Array.from({ length: n }, (_) => this.cards.pop()!).filter(Boolean);
  }

  /**
   * Burns (discards) the top card of the deck.
   * @private
   */
  private burn(): void {
    this.cards.pop();
  }

  /**
   * Removes a specified number of cards from the deck and returns them.
   * @param n The number of cards to remove.
   * @returns An array of cards removed from the deck.
   * @private
   */
  private remove(n: number): Card[] {
    return this.draw(n);
  }

  /**
   * Removes specific Cards from the deck and returns a deck without them.
   * @param cards The cards to remove.
   * @returns A deck without the specified cards.
   * @private
   */
  private removeSpecificCards(cards: Card[]): Card[] {
    return this.cards.filter((card) => !cards.includes(card));
  }

  /**
   * Deals hole cards to the specified number of players in Texas Hold'em (Preflop).
   * @param players The number of players to deal hole cards to.
   * @returns An array of arrays containing hole cards dealt to each player.
   */
  public preflop(players: number): Card[][] {
    return Array.from({ length: players }, (_) => this.draw(2));
  }

  /**
   * Deals three community cards in Texas Hold'em (Flop).
   * @returns An array containing three community cards (the flop).
   */
  public flop(): Card[] {
    this.burn();
    return this.remove(3);
  }

  /**
   * Deals one community card in Texas Hold'em (Turn).
   * @returns An array containing one community card (the turn).
   */
  public turn(): Card[] {
    this.burn();
    return this.remove(1);
  }

  /**
   * Deals one community card in Texas Hold'em (River).
   * @returns An array containing one community card (the river).
   */
  public river(): Card[] {
    this.burn();
    return this.remove(1);
  }
}
