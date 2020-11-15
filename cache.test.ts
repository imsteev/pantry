import PantryCache from "./cache";

describe("cache tests", () => {
  it("smoke test", () => {
    const pantry = new PantryCache();
    pantry.put("hello", "world");
    expect(pantry.get("hello")).toEqual("world");
  });
});
