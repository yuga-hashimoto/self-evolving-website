// Model configuration file
export const MODELS = {
    mimo: {
        id: 'mimo',
        name: 'Mimo',
        description: 'Xiaomi Mimo V2 Flash',
        openrouterModel: 'xiaomi/mimo-v2-flash',
        color: 'purple',
    },
    grok: {
        id: 'grok',
        name: 'Grok',
        description: 'X-AI Grok Code Fast',
        openrouterModel: 'x-ai/grok-code-fast-1',
        color: 'blue',
    },
} as const;

export type ModelId = keyof typeof MODELS;

export function isValidModelId(id: string): id is ModelId {
    return id in MODELS;
}

export function getModel(id: string) {
    if (isValidModelId(id)) {
        return MODELS[id];
    }
    return null;
}
