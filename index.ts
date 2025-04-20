#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

interface AnkiResponse {
    result: number | null;
    error: string | null;
  }

const ADD_NOTE_TOOL: Tool = {
  name: "anki_add_note",
  description: "Add a flashcard to an Anki deck",
  inputSchema: {
    type: "object",
    properties: {
      deckName: { type: "string", description: "The target deck name" },
      front: { type: "string", description: "Front of the flashcard" },
      back: { type: "string", description: "Back of the flashcard" },
    },
    required: ["deckName", "front", "back"],
  },
};

async function addNote(deckName: string, front: string, back: string) {
// Use 127.0.0.1 instead of 'localhost' to avoid IPv6 (::1) resolution issues,
// which can cause connection errors when AnkiConnect is not listening on IPv6.
const response = await fetch("http://127.0.0.1:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "addNote",
      version: 6,
      params: {
        note: {
          deckName,
          modelName: "Basic",
          fields: { Front: front, Back: back },
          options: { allowDuplicate: false },
          tags: [],
        },
      },
    }),
  });

const json = await response.json() as AnkiResponse;

  if (json.error) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to add note: ${json.error}`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `Note added successfully. Note ID: ${json.result}`,
      },
    ],
    isError: false,
  };
}

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
  tools: [ADD_NOTE_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "anki_add_note") {
    const { deckName, front, back } = request.params.arguments as {
      deckName: string;
      front: string;
      back: string;
    };
    return await addNote(deckName, front, back);
  }

  return {
    content: [
      {
        type: "text",
        text: `Unknown tool: ${request.params.name}`,
      },
    ],
    isError: true,
  };
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
