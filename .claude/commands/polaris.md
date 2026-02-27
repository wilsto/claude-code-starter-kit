# Polaris — North Star Setup & Review

Fill or update your personal north star (`memory/polaris.md`) interactively.

## Instructions

1. Read `memory/polaris.md`
2. Determine the current state:

**If empty** (only HTML comments / template placeholders):
- Launch the full interactive flow from the `polaris` skill
- Default to Guided mode (one question at a time)

**If already filled:**
- Display the current content to the user
- Ask which mode they want:
  1. **Update** — Show each section and ask "Still accurate? Want to change anything?" Only rewrite sections the user wants to modify.
  2. **Rewrite** — Start the full question flow from scratch, replacing all content.
  3. **Review** — Show the content, confirm it's still current, suggest updates if anything seems stale (e.g., goals older than 2 months).

3. After any changes, write the updated content to `memory/polaris.md`
4. Confirm: "Your Polaris has been updated. It will be auto-injected at every session start."
