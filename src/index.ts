#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ADD_NOTE_TOOL, ADD_NOTES_TOOL, CREATE_DECK_TOOL } from "./tools/tool-definitions.js";
import { addNote, addNotes, createDeck } from "./tools/tool-handlers.js";


const server = new Server(
  {
    name: "anki/mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [ADD_NOTE_TOOL, ADD_NOTES_TOOL, CREATE_DECK_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {

  switch (request.params.name) {
    case "anki_add_note": {
      const { deckName, front, back } = request.params.arguments as {
        deckName: string;
        front: string;
        back: string;
      };
      return await addNote(deckName, front, back);
    }
    case "anki_add_notes": {
      const { deckName, cards } = request.params.arguments as {
        deckName: string;
        cards: { front: string; back: string }[];
      };
      return await addNotes(deckName, cards);
    }
    case "anki_create_deck": {
      const { deckName } = request.params.arguments as { deckName: string };
      return await createDeck(deckName);
    }
    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
        isError: true,
      };
  }

});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Anki MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});