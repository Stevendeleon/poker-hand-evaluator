import { assertEquals } from "@std/testing/asserts.ts";
import { LookupTable } from "@/lookup.ts";

Deno.test("should generate flushes", () => {
    const lookup = new LookupTable();

    

    // assertEquals(flushes.length, 1277);
    console.log(lookup.flushLookup);
    // assertEquals(flushes[0], 0x1f000000);
    // assertEquals(flushes[1276], 0x1f1f1f1f);
});