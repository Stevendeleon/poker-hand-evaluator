import { Card } from "@/card.ts";

export class Deck {
  public cards: Card[] = [];

  constructor() {
    this.cards = this.create_deck();
  }

  private create_deck(): Card[] {
    return Array.from({ length: 52 }, (_, i) => new Card(i));
  }

  public shuffle(): void {
    const { cards } = this;

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }


  public deal(players: number): Card[][] {
    return Array.from({ length: players }, (_) => this.draw_by(2));
  }

  public remaining(): number {
    return this.cards.length;
  }

  private draw_by(n: number): Card[] {
    return Array.from({ length: n }, (_) => this.cards.pop()!).filter(Boolean);
  }

  private burn(): void {
    this.cards.pop();
  }

  private remove(n: number): Card[] {
    return this.draw_by(n);
  }

  public preflop(players: number): Card[][] {
    return Array.from({ length: players }, (_) => this.draw_by(2));
  }

  public flop(): Card[] {
    this.burn();
    return this.remove(3);
  }

  public turn(): Card[] {
    this.burn();
    return this.remove(1);
  }

  public river(): Card[] {
    this.burn();
    return this.remove(1);
  }
}
