import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ADD_NOTE_TOOL: Tool = {
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

export const ADD_NOTES_TOOL: Tool = {
  name: "anki_add_notes",
  description: "Add multiple flashcards to an Anki deck",
  inputSchema: {
    type: "object",
    properties: {
      deckName: { type: "string", description: "The target deck name" },
      cards: {
        type: "array",
        items: {
          type: "object",
          properties: {
            front: { type: "string" },
            back: { type: "string" },
          },
          required: ["front", "back"],
        },
      },
    },
    required: ["deckName", "cards"],
  },
};

export const CREATE_DECK_TOOL: Tool = {
  name: "anki_create_deck",
  description: "Create a new Anki deck",
  inputSchema: {
    type: "object",
    properties: {
      deckName: { type: "string", description: "The name of the deck to create" },
    },
    required: ["deckName"],
  },
};