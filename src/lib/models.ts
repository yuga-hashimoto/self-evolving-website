// Model configuration file
export const MODELS = {
    ai1: {
        id: 'ai1',
        name: 'AI 1',
        description: 'Free AI Router',
        openrouterModel: 'openrouter/free',
        color: 'purple',
    },
    ai2: {
        id: 'ai2',
        name: 'AI 2',
        description: 'Pony Alpha',
        openrouterModel: 'openrouter/pony-alpha',
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
