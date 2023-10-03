import { PlayingCard } from "@/card.ts";

Deno.bench("Card:  Create 1", () => {
  new PlayingCard("As");
});

Deno.bench({
  name: "Card:  Create 1 -> 10,000 times",
  fn() {
    for (let i = 0; i < 10000; i++) {
      new PlayingCard("As");
    }
  },
});

Deno.bench({
  name: "Card:  Create 1 -> 100,000 times",
  fn() {
    for (let i = 0; i < 100000; i++) {
      new PlayingCard("As");
    }
  },
});

Deno.bench({
  name: "Card:  Create 1 -> 1,000,000 times",
  fn() {
    for (let i = 0; i < 1000000; i++) {
      new PlayingCard("As");
    }
  },
});
