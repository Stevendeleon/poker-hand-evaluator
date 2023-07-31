import { Deck } from "@/deck.ts";

Deno.bench("Deck:  Create (52 Cards)", () => {
  new Deck();
});

Deno.bench("Deck:  Create & Shuffle", () => {
  const deck = new Deck();
  deck.shuffle();
});