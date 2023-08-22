import { assertEquals, assertThrows } from "@std/testing/asserts.ts";
import { PlayingCard } from "@/card.ts";

Deno.test("should be able to create cards", () => {
  const card = new PlayingCard("As");
  assertEquals(card.output, "As");

  const card2 = new PlayingCard("2h");
  assertEquals(card2.output, "2h");

  const card3 = new PlayingCard("Td");
  assertEquals(card3.output, "Td");

  const card4 = new PlayingCard("Jc");
  assertEquals(card4.output, "Jc");
});
Deno.test("should be able to catch errors when creating cards improperly", () => {
  assertThrows(
    () => {
      new PlayingCard("A");
    },
    Error,
    "Invalid card string length",
  );
  assertThrows(
    () => {
      new PlayingCard("Ax");
    },
    Error,
    "Invalid suit character",
  );
  assertThrows(
    () => {
      new PlayingCard("Px");
    },
    Error,
    "Invalid rank character",
  );
});

Deno.test("should be able to represent cards", () => {
  const card = new PlayingCard("As");
  assertEquals(card.repr, 'Card("As")');

  const card2 = new PlayingCard("2h");
  assertEquals(card2.repr, 'Card("2h")');

  const card3 = new PlayingCard("Td");
  assertEquals(card3.repr, 'Card("Td")');
});
//
// /**
//  * @note: a Deuce (2) is the lowest rank at 0
//  * @note: an Ace (A) is the highest rank at 12
//  */
// Deno.test("should be able to determine a card's specific rank", () => {
//   const card = new PlayingCard("As");
//   assertEquals(card.rank, 12);
//
//   const card2 = new PlayingCard("2h");
//   assertEquals(card2.rank, 0);
//
//   const card3 = new PlayingCard("Td");
//   assertEquals(card3.rank, 8);
// });
//
// /**
//  * @note: a Spade (♠) is mapped to 1
//  * @note: a Heart (♥) is mapped to 2
//  * @note: a Diamond (♦) is mapped to 4
//  * @note: a Club (♣) is mapped to 8
//  */
// Deno.test("should be able to map a card's Suit correctly", () => {
//   const card = new PlayingCard("As");
//   assertEquals(card.suit, 1);
//
//   const card2 = new PlayingCard("2h");
//   assertEquals(card2.suit, 2);
//
//   const card3 = new PlayingCard("Td");
//   assertEquals(card3.suit, 4);
//
//   const card4 = new PlayingCard("Jc");
//   assertEquals(card4.suit, 8);
// });
//
// Deno.test("should return a card's bitrank", () => {
//   const card = new PlayingCard("As");
//   assertEquals(card.bitrank, 1 << 12);
//
//   const card2 = new PlayingCard("2h");
//   assertEquals(card2.bitrank, 1);
//
//   const card3 = new PlayingCard("Td");
//   assertEquals(card3.bitrank, 1 << 8);
//
//   const card4 = new PlayingCard("Jc");
//   assertEquals(card4.bitrank, 1 << 9);
// });
//
// Deno.test("should return a card's prime", () => {
//   const card = new PlayingCard("As");
//   assertEquals(card.prime, 41);
//
//   const card2 = new PlayingCard("2h");
//   assertEquals(card2.prime, 2);
//
//   const card3 = new PlayingCard("Td");
//   assertEquals(card3.prime, 23);
// });
//
// Deno.test("should return a card as a tuple of its rank and suit in a nice format we like to call pretty", () => {
//   const card = new PlayingCard("As");
//   assertEquals(card.prettify, "[ A ♠ ]");
//
//   const card2 = new PlayingCard("2h");
//   assertEquals(card2.prettify, "[ 2 ♥ ]");
//
//   const card3 = new PlayingCard("Td");
//   assertEquals(card3.prettify, "[ T ♦ ]");
//
//   const card4 = new PlayingCard("3c");
//   assertEquals(card4.prettify, "[ 3 ♣ ]");
// });
//
// Deno.test("should return a binary string for a given card", () => {
//   const card = new PlayingCard("As");
//   assertEquals(card.binaryString, "10000000000000000001011000001001001");
//
//   const card2 = new PlayingCard("2h");
//   assertEquals(card2.binaryString, "00\t0000\t0000100010000000000000010");
// });
//
// // Helper functions
//
// Deno.test("cardStringsToInt: should take in a list of card strings and return a list of integers", () => {
//   const cards = ["As", "2h", "Td", "Jc"];
//   const result = cardStringsToInt(cards);
//
//   assertEquals(result[0].cardIntValue, 268442665);
//   assertEquals(result[1].cardIntValue, 73730);
//   assertEquals(result[2].cardIntValue, 16795671);
//   assertEquals(result[3].cardIntValue, 33589533);
// });
//
// Deno.test("primeProductFromHands: should take in a list of cards and return the product of their primes", () => {
//   const c1 = new PlayingCard("As");
//   const c2 = new PlayingCard("2h");
//   const c3 = new PlayingCard("Td");
//   const c4 = new PlayingCard("Jc");
//
//   const cards = [c1, c2, c3, c4];
//   const result = primeProductFromHands(cards);
//
//   assertEquals(result, 54694);
// });
//
// Deno.test("primeProductFromRankbits: should take in a rankbit number and return the product of their primes", () => {
//   const bits = 0b0000000;
//   const result = primeProductFromRankbits(bits);
//
//   assertEquals(result, 1);
// });
//
// Deno.test("prettifyListOfCards: should take in a list of cards and return a pretty string", () => {
//   const c1 = new PlayingCard("As");
//   const c2 = new PlayingCard("2h");
//   const c3 = new PlayingCard("Td");
//   const c4 = new PlayingCard("Jc");
//
//   console.log(c1, c2);
//
//   const cards = [c1, c2, c3, c4];
//   const result = prettifyListOfCards(cards);
//
//   assertEquals(result, "[ A ♠ ] [ 2 ♥ ] [ T ♦ ] [ J ♣ ]");
// });
//
// // Rank value tests
// Deno.test("should be able to compare ranks", () => {
//   const c2 = new PlayingCard("2h");
//   const c3 = new PlayingCard("3h");
//   const c4 = new PlayingCard("4h");
//   const c5 = new PlayingCard("5h");
//   const c6 = new PlayingCard("6h");
//   const c7 = new PlayingCard("7h");
//   const c8 = new PlayingCard("8h");
//   const c9 = new PlayingCard("9h");
//   const cT = new PlayingCard("Th");
//   const cJ = new PlayingCard("Jh");
//   const cQ = new PlayingCard("Qh");
//   const cK = new PlayingCard("Kh");
//   const cA = new PlayingCard("Ah");
//
//   // ranks
//   assertEquals(c2.rank, 0);
//   assertEquals(c3.rank, 1);
//   assertEquals(c4.rank, 2);
//   assertEquals(c5.rank, 3);
//   assertEquals(c6.rank, 4);
//   assertEquals(c7.rank, 5);
//   assertEquals(c8.rank, 6);
//   assertEquals(c9.rank, 7);
//   assertEquals(cT.rank, 8);
//   assertEquals(cJ.rank, 9);
//   assertEquals(cQ.rank, 10);
//   assertEquals(cK.rank, 11);
//   assertEquals(cA.rank, 12);
//
//   // comparisons
//   assertEquals(c2.rank < c3.rank, true);
//   assertEquals(c3.rank < c4.rank, true);
//   assertEquals(c4.rank < c5.rank, true);
//   assertEquals(c5.rank < c6.rank, true);
//   assertEquals(c6.rank < c7.rank, true);
//   assertEquals(c7.rank < c8.rank, true);
//   assertEquals(c8.rank < c9.rank, true);
//   assertEquals(c9.rank < cT.rank, true);
//   assertEquals(cT.rank < cJ.rank, true);
//   assertEquals(cJ.rank < cQ.rank, true);
//   assertEquals(cQ.rank < cK.rank, true);
//   assertEquals(cK.rank < cA.rank, true);
//
//   // rank equality
//   const c2b = new PlayingCard("2d");
//   assertEquals(c2.rank === c2b.rank, true);
// });
