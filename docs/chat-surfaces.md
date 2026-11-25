# Inline chat surfaces

Bots can call `show_chat_surface` to compare alternatives side by side or present an ordered set of steps. A short factual answer should stay ordinary text. For example, ask a bot to compare two travel options in a chat surface.

The tool uses a small [A2UI](https://github.com/a2ui-project/a2ui) 1.0 catalog, `urn:rakazo:chat:1`. Send one `createSurface` with a `root` Row or Column referencing one to eight literal Text components. The child order controls reading order. A reference to a missing or duplicate component rejects the whole surface before it reaches the conversation. This catalog is display-only: it does not support forms, actions, remote components or streamed updates.

Web and desktop lay out rows within the chat column and stack them when space runs out. Mobile rows wrap within their parent, allowing for the system font scale. Colors follow the active app theme.
