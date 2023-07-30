import { assertEquals, assert } from "https://deno.land/std@0.196.0/testing/asserts.ts";
import { Card } from "../card.ts";

Deno.test("Card", () => {
  const card = new Card("As");
  assertEquals(card.toString(), "As");

  const card2 = new Card("2h");
  assertEquals(card2.toString(), "2h");

  const card3 = new Card("Td");
  assertEquals(card3.toString(), "Td");
});

Deno.test("Card.repr", () => {
  const card = new Card("As");
  assertEquals(card.repr(), 'Card("As")');

  const card2 = new Card("2h");
  assertEquals(card2.repr(), 'Card("2h")');

  const card3 = new Card("Td");
  assertEquals(card3.repr(), 'Card("Td")');
});

Deno.test("Card.rank", () => {
  const card = new Card("As");
  assertEquals(card.rank, 12);

  const card2 = new Card("2h");
  assertEquals(card2.rank, 0);

  const card3 = new Card("Td");
  assertEquals(card3.rank, 8);
});

Deno.test("Card.suit", () => {
  const card = new Card("As");
  assertEquals(card.suit, 1);

  const card2 = new Card("2h");
  assertEquals(card2.suit, 2);

  const card3 = new Card("Td");
  assertEquals(card3.suit, 4);
});

Deno.test("Card.bitrank", () => {
  const card = new Card("As");
  assertEquals(card.bitrank, 1 << 12);

  const card2 = new Card("2h");
  assertEquals(card2.bitrank, 1);

  const card3 = new Card("Td");
  assertEquals(card3.bitrank, 1 << 8);
});

Deno.test("Card.prime", () => {
  const card = new Card("As");
  assertEquals(card.prime, 41);

  const card2 = new Card("2h");
  assertEquals(card2.prime, 2);

  const card3 = new Card("Td");
  assertEquals(card3.prime, 23);
});

Deno.test("Card.pretty_string", () => {
  const card = new Card("As");
  assertEquals(card.pretty_string, "[ A ♠ ]");

  const card2 = new Card("2h");
  assertEquals(card2.pretty_string, "[ 2 ♥ ]");

  const card3 = new Card("Td");
  assertEquals(card3.pretty_string, "[ T ♦ ]");

  const card4 = new Card("3c");
  assertEquals(card4.pretty_string, "[ 3 ♣ ]");
});

Deno.test("Card.binary_string", () => {
  const card = new Card("As");
  assertEquals(card.binary_string, "10000000000000000001011000001001001");

  const card2 = new Card("2h");
  assertEquals(card2.binary_string, "00\t0000\t0000100010000000000000010");
});


