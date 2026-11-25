import type { ChatSurface } from "@rakazo/contracts";
import { chatSurfaceLayout } from "@rakazo/contracts";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useMobileTokens } from "../../lib/native/native";

// A row item's share of the width before wrapping, scaled with the system font size.
const ROW_ITEM_BASE_BASIS = 200;

const styles = StyleSheet.create({
  card: { alignSelf: "stretch" },
  column: { gap: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  item: {
    borderRadius: 16,
    flexShrink: 1,
    maxWidth: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowItem: { flexGrow: 1 },
  text: { fontSize: 15 },
});

/** A surface the bot showed in chat: options in a wrapping row, or steps in a column. */
export function ChatSurfaceCard({ surface }: { surface: ChatSurface }) {
  const tokens = useMobileTokens();
  const { fontScale } = useWindowDimensions();
  const { horizontal, items } = chatSurfaceLayout(surface);
  return (
    <View style={styles.card}>
      <View style={horizontal ? styles.row : styles.column}>
        {items.map((item) => (
          <View
            key={item.id}
            style={[
              styles.item,
              horizontal ? [styles.rowItem, { flexBasis: ROW_ITEM_BASE_BASIS * fontScale }] : null,
              { backgroundColor: tokens.muted },
            ]}
          >
            <Text selectable style={[styles.text, { color: tokens.foreground }]}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
