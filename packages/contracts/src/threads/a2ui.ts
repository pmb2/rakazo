import * as z from "zod";

const surfaceItemId = z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,39}$/);
const surfaceText = z.strictObject({
  id: surfaceItemId,
  component: z.literal("Text"),
  text: z.string().trim().min(1).max(1200),
});
const surfaceLayout = z.strictObject({
  id: z.literal("root"),
  component: z.enum(["Row", "Column"]),
  children: z.array(surfaceItemId).min(1).max(8),
});

/** A single-message A2UI 1.0 surface: literal text under one root layout. */
export const ChatSurface = z
  .strictObject({
    version: z.literal("1.0"),
    createSurface: z.strictObject({
      surfaceId: surfaceItemId,
      catalogId: z.literal("urn:rakazo:chat:1"),
      components: z
        .array(z.discriminatedUnion("component", [surfaceLayout, surfaceText]))
        .min(2)
        .max(9),
    }),
  })
  .refine(({ createSurface: { components } }) => {
    const root = components.find((component) => component.component !== "Text");
    const ids = new Set(components.map((component) => component.id));
    return (
      root !== undefined &&
      ids.size === components.length &&
      root.children.length === ids.size - 1 &&
      new Set(root.children).size === root.children.length &&
      root.children.every((id) => id !== "root" && ids.has(id))
    );
  }, "The root must reference every text component exactly once.");

export type ChatSurface = z.infer<typeof ChatSurface>;

/** What the renderer draws: the layout direction, and the texts in display order. */
export function chatSurfaceLayout(surface: ChatSurface) {
  const components = surface.createSurface.components;
  const root = components.find((component) => component.component !== "Text")!;
  const texts = new Map(
    components.flatMap((component) =>
      component.component === "Text" ? [[component.id, component.text] as const] : [],
    ),
  );
  return {
    horizontal: root.component === "Row",
    items: root.children.map((id) => ({ id, text: texts.get(id)! })),
  };
}
