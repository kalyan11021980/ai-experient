'use client';

import { useSimulationStore } from '@/lib/store';
import { CharacterRole, AIProvider } from '@/lib/types';

const providerOptions: { value: AIProvider; label: string; models: string[] }[] = [
  {
    value: 'openai',
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']
  },
  {
    value: 'anthropic',
    label: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']
  },
  {
    value: 'google',
    label: 'Google',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']
  },
  {
    value: 'ollama',
    label: 'Ollama (Local)',
    models: ['llama3.1:latest', 'deepseek-coder-v2:16b', 'qwen2.5:14b', 'deepseek-r1:14b']
  }
];

const characterLabels: Record<CharacterRole, string> = {
  jobSeeker: 'Job Seeker',
  interviewer1: 'Interviewer 1 (Technical)',
  interviewer2: 'Interviewer 2 (Technical)',
  hr: 'HR Manager',
  director: 'Director'
};

const getCharacterEmoji = (role: CharacterRole): string => {
  const emojis = {
    jobSeeker: '🧑‍💻',
    interviewer1: '👩‍💼',
    interviewer2: '👨‍💼',
    hr: '👩‍💼',
    director: '🤵'
  };
  return emojis[role];
};

export function CharacterConfiguration() {
  const { characters, setCharacter } = useSimulationStore();

  const handleProviderChange = (role: CharacterRole, provider: AIProvider) => {
    const providerConfig = providerOptions.find(p => p.value === provider);
    const defaultModel = providerConfig?.models[0] || '';
    
    setCharacter(role, {
      ...characters[role],
      provider,
      model: defaultModel
    });
  };

  const handleModelChange = (role: CharacterRole, model: string) => {
    setCharacter(role, {
      ...characters[role],
      model
    });
  };

  const handleNameChange = (role: CharacterRole, name: string) => {
    setCharacter(role, {
      ...characters[role],
      name
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">⚙️ Character Configuration</h2>
      
      <div className="space-y-4">
        {Object.keys(characters).map((role) => {
          const characterRole = role as CharacterRole;
          const character = characters[characterRole];
          const currentProvider = providerOptions.find(p => p.value === character.provider);
          
          return (
            <div key={role} className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-white/50 to-slate-50/50 hover:shadow-md transition-all duration-200">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-lg">{getCharacterEmoji(characterRole)}</span>
                {characterLabels[characterRole]}
              </h3>
              
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={character.name}
                    onChange={(e) => handleNameChange(characterRole, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>
                
                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    AI Provider
                  </label>
                  <select
                    value={character.provider}
                    onChange={(e) => handleProviderChange(characterRole, e.target.value as AIProvider)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  >
                    {providerOptions.map((provider) => (
                      <option key={provider.value} value={provider.value}>
                        {provider.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Model
                  </label>
                  <select
                    value={character.model}
                    onChange={(e) => handleModelChange(characterRole, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  >
                    {currentProvider?.models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 