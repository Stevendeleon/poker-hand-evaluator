import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.196.0/testing/asserts.ts";
import { getName } from "../main.ts";

Deno.test("getName", () => {
  assertEquals(getName("deno"), "deno");
});

Deno.test("getName2", () => {
  assertNotEquals(getName("deno"), "den0");
});
