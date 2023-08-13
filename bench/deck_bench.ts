import { Deck } from "@/deck.ts";

Deno.bench("Deck:  Create (52 Cards)", () => {
  new Deck();
});

Deno.bench({
  name: "Deck:  Create (52 Cards) -> 10,000 times",
  fn() {
    for (let i = 0; i < 10000; i++) {
      new Deck();
    }
  },
});

Deno.bench({
  name: "Deck:  Create (52 Cards) -> 100,000 times",
  fn() {
    for (let i = 0; i < 100000; i++) {
      new Deck();
    }
  },
});

// This is expensive ^_^
// Deno.bench({
//   name: "Deck:  Create (52 Cards) -> 1,000,000 times",
//   fn() {
//     for (let i = 0; i < 1000000; i++) {
//       new Deck();
//     }
//   },
// });

Deno.bench("Deck:  Create & Shuffle", () => {
  const deck = new Deck();
  deck.shuffle();
});

Deno.bench({
  name: "Deck:  Create once, shuffle -> 100 times",
  fn() {
    const deck = new Deck();
    for (let i = 0; i < 100; i++) {
      deck.shuffle();
    }
  },
});

Deno.bench("Deck:  Deal (9) Players", () => {
  const deck = new Deck();
  deck.deal(9);
});
