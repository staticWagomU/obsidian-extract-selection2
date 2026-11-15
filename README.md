
### Append selection to an existing note

Run **Append selection to existing note**, select a Markdown note, then select a heading or **End of note**. Text is appended at the end of the selected section, including its subsections. ATX and setext headings outside YAML frontmatter and fenced code are offered. Escape cancels without changes. The source note is excluded. If either note changes while choosing, retry; unsaved destination edits also prevent the operation. The existing **Insert link after extract** setting replaces the original selection with a link after a successful append. This command requires Obsidian's `Vault.process` API (Obsidian 1.1.0 or later). It works locally and makes no network requests.
