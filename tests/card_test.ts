import { assertEquals } from "@std/testing/asserts.ts";
import {
  Card,
  card_list_to_pretty_str,
  card_strings_to_int,
  prime_product_from_hand,
  prime_product_from_rankbits,
} from "@/card.ts";

Deno.test("should be able to create cards", () => {
  const card = new Card("As");
  assertEquals(card.toString(), "As");

  const card2 = new Card("2h");
  assertEquals(card2.toString(), "2h");

  const card3 = new Card("Td");
  assertEquals(card3.toString(), "Td");
});

Deno.test("should be able to represent cards", () => {
  const card = new Card("As");
  assertEquals(card.repr(), 'Card("As")');

  const card2 = new Card("2h");
  assertEquals(card2.repr(), 'Card("2h")');

  const card3 = new Card("Td");
  assertEquals(card3.repr(), 'Card("Td")');
});

/**
 * @note: a Deuce (2) is the lowest rank at 0
 * @note: an Ace (A) is the highest rank at 12
 */
Deno.test("should be able to determine a card's specific rank", () => {
  const card = new Card("As");
  assertEquals(card.rank, 12);

  const card2 = new Card("2h");
  assertEquals(card2.rank, 0);

  const card3 = new Card("Td");
  assertEquals(card3.rank, 8);
});

/**
 * @note: a Spade (♠) is mapped to 1
 * @note: a Heart (♥) is mapped to 2
 * @note: a Diamond (♦) is mapped to 4
 * @note: a Club (♣) is mapped to 8
 */
Deno.test("should be able to map a card's Suit correctly", () => {
  const card = new Card("As");
  assertEquals(card.suit, 1);

  const card2 = new Card("2h");
  assertEquals(card2.suit, 2);

  const card3 = new Card("Td");
  assertEquals(card3.suit, 4);

  const card4 = new Card("Jc");
  assertEquals(card4.suit, 8);
});

Deno.test("should return a card's bitrank", () => {
  const card = new Card("As");
  assertEquals(card.bitrank, 1 << 12);

  const card2 = new Card("2h");
  assertEquals(card2.bitrank, 1);

  const card3 = new Card("Td");
  assertEquals(card3.bitrank, 1 << 8);

  const card4 = new Card("Jc");
  assertEquals(card4.bitrank, 1 << 9);
});

Deno.test("should return a card's prime", () => {
  const card = new Card("As");
  assertEquals(card.prime, 41);

  const card2 = new Card("2h");
  assertEquals(card2.prime, 2);

  const card3 = new Card("Td");
  assertEquals(card3.prime, 23);
});

Deno.test("should return a card as a tuple of its rank and suit in a nice format we like to call pretty", () => {
  const card = new Card("As");
  assertEquals(card.pretty_string, "[ A ♠ ]");

  const card2 = new Card("2h");
  assertEquals(card2.pretty_string, "[ 2 ♥ ]");

  const card3 = new Card("Td");
  assertEquals(card3.pretty_string, "[ T ♦ ]");

  const card4 = new Card("3c");
  assertEquals(card4.pretty_string, "[ 3 ♣ ]");
});

Deno.test("should return a binary string for a given card", () => {
  const card = new Card("As");
  assertEquals(card.binary_string, "10000000000000000001011000001001001");

  const card2 = new Card("2h");
  assertEquals(card2.binary_string, "00\t0000\t0000100010000000000000010");
});

// helper functions

// card_strings_to_int
Deno.test("card_strings_to_int: should take in a list of card strings and return a list of integers", () => {
  const cards = ["As", "2h", "Td", "Jc"];
  const result = card_strings_to_int(cards);

  assertEquals(result[0].card_int, 268442665);
  assertEquals(result[1].card_int, 73730);
  assertEquals(result[2].card_int, 16795671);
  assertEquals(result[3].card_int, 33589533);
});

// prime_product_from_hand
Deno.test("prime_product_from_hand: should take in a list of cards and return the product of their primes", () => {
  const c1 = new Card("As");
  const c2 = new Card("2h");
  const c3 = new Card("Td");
  const c4 = new Card("Jc");

  const cards = [c1, c2, c3, c4];
  const result = prime_product_from_hand(cards);

  assertEquals(result, 54694);
});

// prime_product_from_rankbits
Deno.test("prime_product_from_rankbits: should take in a rankbit number and return the product of their primes", () => {
  const bits = 0b0000000;
  const result = prime_product_from_rankbits(bits);

  assertEquals(result, 1);
});

// card_list_to_pretty_str
Deno.test("card_list_to_pretty_str: should take in a list of cards and return a pretty string", () => {
  const c1 = new Card("As");
  const c2 = new Card("2h");
  const c3 = new Card("Td");
  const c4 = new Card("Jc");

  const cards = [c1, c2, c3, c4];
  const result = card_list_to_pretty_str(cards);

  assertEquals(result, "[ A ♠ ] [ 2 ♥ ] [ T ♦ ] [ J ♣ ]");
});
