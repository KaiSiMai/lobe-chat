import { DEFAULT_OPENAI_MODEL_LIST } from '@/const/llm';
import { CustomModels } from '@/types/settings';

import { GlobalStore } from '../../../store';

const openAIAPIKeySelectors = (s: GlobalStore) => s.settings.languageModel.openAI.OPENAI_API_KEY;
const zhipuAPIKey = (s: GlobalStore) => s.settings.languageModel.zhipu.ZHIPU_API_KEY;
const enabledZhipu = (s: GlobalStore) => s.settings.languageModel.zhipu.enabled || false;

const openAIProxyUrlSelectors = (s: GlobalStore) => s.settings.languageModel.openAI.endpoint;

const modelListSelectors = (s: GlobalStore) => {
  let models: CustomModels = [];

  const removedModels: string[] = [];
  const modelNames = [
    ...DEFAULT_OPENAI_MODEL_LIST,
    ...(s.serverConfig.customModelName || '').split(/[,，]/).filter(Boolean),
    ...(s.settings.languageModel.openAI.customModelName || '').split(/[,，]/).filter(Boolean),
  ];

  for (const item of modelNames) {
    const disable = item.startsWith('-');
    const nameConfig = item.startsWith('+') || item.startsWith('-') ? item.slice(1) : item;
    const [name, displayName] = nameConfig.split('=');

    if (disable) {
      // Disable all models.
      if (name === 'all') {
        models = [];
      }
      removedModels.push(name);
      continue;
    }

    // Remove duplicate model entries.
    const existingIndex = models.findIndex(({ name: n }) => n === name);
    if (existingIndex !== -1) {
      models.splice(existingIndex, 1);
    }

    models.push({
      displayName: displayName || name,
      name,
    });
  }

  return models.filter((m) => !removedModels.includes(m.name));
};

export const modelProviderSelectors = {
  enabledZhipu,
  modelList: modelListSelectors,
  openAIAPI: openAIAPIKeySelectors,
  openAIProxyUrl: openAIProxyUrlSelectors,
  zhipuAPIKey,
};
