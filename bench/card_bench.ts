import { Card } from "@/card.ts";

Deno.bench("Card:  Create 1", () => {
  new Card("As");
});

// Deno.bench({
//   func: function create_deck_1000x(b: any): void {
//     b.start();
//     new Card("As");
//     b.stop();
//   },
//   name: "Card:  Create 1 -> 1,000x",
//   runs: 1000,
// });

Deno.bench("Card:  Create Two", () => {
  new Card("As");
  new Card("Ad");
});

Deno.bench("Card:  Create Five", () => {
  new Card("As");
  new Card("Ad");
  new Card("Ah");
  new Card("Ac");
  new Card("Ks");
});