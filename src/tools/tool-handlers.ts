
interface AnkiResponse {
    result: number | null;
    error: string | null;
}



export async function createDeck(deckName: string) {
    const response = await fetch("http://127.0.0.1:8765", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "createDeck",
            version: 6,
            params: { deck: deckName },
        }),
    });

    const json = (await response.json()) as AnkiResponse;

    if (json.error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to create deck: ${json.error}`,
                },
            ],
            isError: true,
        };
    }

    return {
        content: [
            {
                type: "text",
                text: `✅ Deck '${deckName}' created.`,
            },
        ],
        isError: false,
    };
}

export async function addNotes(deckName: string, cards: { front: string; back: string }[]) {
    const notes = cards.map(({ front, back }) => ({
        deckName,
        modelName: "Basic",
        fields: {
            Front: front,
            Back: back,
        },
        options: {
            allowDuplicate: false,
        },
        tags: [],
    }));

    const response = await fetch("http://127.0.0.1:8765", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "addNotes",
            version: 6,
            params: {
                notes,
            },
        }),
    });

    const json = (await response.json()) as AnkiResponse;

    if (json.error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to add notes: ${json.error}`,
                },
            ],
            isError: true,
        };
    }

    return {
        content: [
            {
                type: "text",
                text: `Successfully added ${cards.length} notes.`,
            },
        ],
        isError: false,
    };
}

export async function addNote(deckName: string, front: string, back: string) {
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

    const json = (await response.json()) as AnkiResponse;

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

export async function getDecks() {
    const response = await fetch("http://127.0.0.1:8765", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deckNamesAndIds",
        version: 6,
      }),
    });
  
    const json = (await response.json()) as AnkiResponse;

  
    if (json.error) {
      return {
        content: [{ type: "text", text: `Failed to get decks: ${json.error}` }],
        isError: true,
      };
    }
  
    return {
      content: [
        {
          type: "text",
          text: `Decks retrieved successfully: ${JSON.stringify(json.result, null, 2)}`,
        },
      ],
      isError: false,
    };
  }
  