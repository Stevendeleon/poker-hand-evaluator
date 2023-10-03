import { combinations } from "../util.ts";
import { assertEquals, assertThrows, assertNotEquals } from "@std/assert/mod.ts";

Deno.test("should be able to generate combinations", () => {
    const iterable = [1, 2, 3, 4];
    const r = 2;
    const expected = [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
    ];
    const actual = [...combinations(iterable, r)];
    assertEquals(actual, expected);
});

Deno.test("should be able to generate combinations with a different r", () => {
    const iterable = [1, 2, 3, 4];
    const r = 3;
    const expected = [
        [1, 2, 3],
        [1, 2, 4],
        [1, 3, 4],
        [2, 3, 4],
    ];
    const actual = [...combinations(iterable, r)];
    assertEquals(actual, expected);
});

Deno.test("should be able to generate combinations with a different iterable", () => {
    const iterable = [1, 2, 3, 4, 5];
    const r = 4;
    const expected = [
        [1, 2, 3, 4],
        [1, 2, 3, 5],
        [1, 2, 4, 5],
        [1, 3, 4, 5],
        [2, 3, 4, 5],
    ];
    const actual = [...combinations(iterable, r)];
    assertEquals(actual, expected);
});

