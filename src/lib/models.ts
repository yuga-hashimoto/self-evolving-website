// Model configuration file
export const MODELS = {
    mimo: {
        id: 'mimo',
        name: 'AI 1',
        description: 'Z-AI GLM 4.5 Air',
        openrouterModel: 'z-ai/glm-4.5-air:free',
        color: 'purple',
    },
    grok: {
        id: 'grok',
        name: 'AI 2',
        description: 'DeepSeek R1t2 Chimera',
        openrouterModel: 'tngtech/deepseek-r1t2-chimera:free',
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
