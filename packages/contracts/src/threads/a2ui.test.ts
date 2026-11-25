import { describe, expect, it } from "vitest";
import { ChatSurface, chatSurfaceLayout } from "./a2ui.js";

function surface(component: "Row" | "Column", children: string[]) {
  return {
    version: "1.0",
    createSurface: {
      surfaceId: "compare",
      catalogId: "urn:rakazo:chat:1",
      components: [
        { id: "root", component, children },
        ...children.map((id, index) => ({ id, component: "Text", text: `Option ${index + 1}` })),
      ],
    },
  };
}

describe("ChatSurface", () => {
  it("renders the children in the order the root lists", () => {
    const parsed = ChatSurface.parse(surface("Row", ["second", "first"]));
    expect(chatSurfaceLayout(parsed)).toMatchObject({
      horizontal: true,
      items: [
        { id: "second", text: "Option 2" },
        { id: "first", text: "Option 1" },
      ],
    });
  });

  it("rejects a root that does not reference every text exactly once", () => {
    const unreferenced = {
      version: "1.0",
      createSurface: {
        surfaceId: "compare",
        catalogId: "urn:rakazo:chat:1",
        components: [
          { id: "root", component: "Column", children: ["a"] },
          { id: "a", component: "Text", text: "Kept" },
          { id: "b", component: "Text", text: "Never referenced" },
        ],
      },
    };
    expect(ChatSurface.safeParse(unreferenced).success).toBe(false);
  });
});
