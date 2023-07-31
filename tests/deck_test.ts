import { Deck } from "@/deck.ts";
import { assertEquals, assertNotEquals } from "@std/testing/asserts.ts";

Deno.test("should be able to create a deck of 52 cards", () => {
  const deck = new Deck();
  assertEquals(deck.remaining(), 52);
});

Deno.test("should be able to shuffle decks", () => {
  const deck = new Deck();
  const deck2 = new Deck();
  const deck3 = new Deck();
  deck.shuffle();
  deck2.shuffle();
  deck3.shuffle();

  assertNotEquals(deck.cards, deck2.cards);
  assertNotEquals(deck.cards, deck3.cards);
  assertNotEquals(deck2.cards, deck3.cards);
});

Deno.test("should be able to deal cards based on n number of players", () => {
  const players = 9;
  const deck = new Deck();
  deck.shuffle();
  const cards = deck.deal(players);
  assertEquals(cards.length, players);
  assertEquals(deck.remaining(), 52 - players * 2);
});

Deno.test("should correctly output the remaining number of cards left in the deck", () => {
  const deck = new Deck();
  assertEquals(deck.remaining(), 52);
  deck.shuffle();
  deck.deal(12);
  assertEquals(deck.remaining(), 52 - 12 * 2);
});

/**
 * @note: This is a private method, so we need to test it through a public method (deck.deal())
 */
Deno.test("should be able to draw by n number of cards", () => {
  const deck = new Deck();
  deck.shuffle();
  const cards = deck.deal(1);
  assertEquals(cards.length, 1);
  assertEquals(deck.remaining(), 52 - 1 * 2);
});

/**
 * @note: This is a private method, so we need to test it through a public method (deck.turn())
 */
Deno.test("should correctly remove n number of cards from the deck", () => {
  const deck = new Deck();
  deck.shuffle();
  deck.turn();
  assertEquals(deck.remaining(), 52 - 1 - 1);
});

/**
 * @note: This is a private method, so we need to test it through a public method (deck.flop())
  */
Deno.test("should correctly burn a card", () => {
  const deck = new Deck();
  deck.shuffle();
  deck.flop();
  assertEquals(deck.remaining(), 52 - 3 - 1);
});

Deno.test("should correctly deal the flop", () => {
  // this will burn 1 card
  const deck = new Deck();
  deck.shuffle();
  const flop = deck.flop();
  assertEquals(flop.length, 3);
  assertEquals(deck.remaining(), 52 - 3 - 1);
});

Deno.test("should correctly deal the turn", () => {
  // this will burn 2 cards
  const deck = new Deck();
  deck.shuffle();
  const flop = deck.flop();
  const turn = deck.turn();
  assertEquals(flop.length, 3);
  assertEquals(turn.length, 1);
  assertEquals(deck.remaining(), 52 - 3 - 1 - 1 - 1);
});

Deno.test("should correctly deal the river", () => {
  // this will burn 3 cards
  const deck = new Deck();
  deck.shuffle();
  const flop = deck.flop();
  const turn = deck.turn();
  const river = deck.river();
  assertEquals(flop.length, 3);
  assertEquals(turn.length, 1);
  assertEquals(river.length, 1);
  assertEquals(deck.remaining(), 52 - 3 - 1 - 1 - 1 - 1 - 1);
});

Deno.test("should correctly create a deck, shuffle, deal to 6 players, deal the flop, turn, and river", () => {
  const deck = new Deck();
  deck.shuffle();
  const players = 6;
  const cards = deck.deal(players);
  const flop = deck.flop();
  const turn = deck.turn();
  const river = deck.river();
  assertEquals(cards.length, players);
  assertEquals(flop.length, 3);
  assertEquals(turn.length, 1);
  assertEquals(river.length, 1);
  assertEquals(deck.remaining(), 52 - players * 2 - 3 - 1 - 1 - 1 - 1 - 1);
});