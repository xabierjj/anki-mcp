# 🧠 Anki MCP Server

This is a lightweight [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that integrates with [AnkiConnect](https://git.sr.ht/~foosoft/anki-connect) to enable AI tools like Claude or Cursor to create flashcards in Anki via local tooling.

It supports:
- ✅ Creating new Anki decks
- ✅ Adding single notes (cards)
- ✅ Adding multiple notes at once

---

## 🧩 Installing AnkiConnect

To enable communication between this MCP server and Anki, you'll need to install the **AnkiConnect** plugin in your Anki desktop app.

### 📦 Steps to install AnkiConnect

1. **Open Anki Desktop** (not AnkiWeb or the mobile app).
2. Go to the menu: `Tools` → `Add-ons`.
3. Click on `Get Add-ons...`.
4. Enter the following code:
   ```
   2055492159
   ```
5. Click `OK`, then restart Anki.

You should now see **AnkiConnect** listed in your installed add-ons.

To verify it's running, open your browser and visit:
```
http://127.0.0.1:8765
```
You should see:
```json
{"apiVersion": "AnkiConnect v.6"}
```

---

## 🧠 Usage with Claude Desktop

To use this MCP server with **Claude Desktop**, add the following to your `claude_desktop_config.json` file:

### ✅ Local configuration (using `node` + compiled code)

Make sure to run npm run build first to generate the dist/index.js file.
Replace /absolute/path/to/anki-mcp/dist/index.js with the full absolute path to the compiled file on your system.

```json
{
  "mcpServers": {
    "anki": {
      "command": "node",
      "args": [
        "/absolute/path/to/anki-mcp/dist/index.js"
      ]
    }
  }
}
```

> 💡 You can adapt the paths based on your machine and environment.

Once added, restart Claude Desktop and you should see your tool available inside Claude’s "Tools" tab.

---

## 🛠 Available Tools (MCP)

| Tool Name         | Description                               |
|------------------|-------------------------------------------|
| `anki_create_deck` | Create a new Anki deck                    |
| `anki_add_note`    | Add a single flashcard to a deck         |
| `anki_add_notes`   | Add multiple flashcards at once          |

---


