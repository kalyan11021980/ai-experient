import { CharacterRole, Character } from './types';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAIResponse(
  character: Character,
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  console.log('generateAIResponse: Starting AI call for character:', character.role);
  console.log('generateAIResponse: Provider:', character.provider, 'Model:', character.model);
  
  try {
    const requestBody = {
      messages,
      provider: character.provider,
      model: character.model,
      characterRole: character.role,
      systemPrompt,
      characterName: character.name,
    };

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('generateAIResponse: Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('generateAIResponse: API Error Response:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
    }

    // Parse the JSON response
    const data = await response.json();
    
    console.log('generateAIResponse: Response data:', data);

    if (!data.text || !data.text.trim()) {
      console.error('generateAIResponse: Empty text in response');
      throw new Error('Empty response from AI service');
    }

    console.log('generateAIResponse: Success! Text length:', data.text.length);
    return data.text.trim();

  } catch (error) {
    console.error('generateAIResponse: Error:', error);
    throw new Error(`Failed to generate AI response for ${character.role}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function createConversationHistory(messages: Array<{ character: CharacterRole; content: string }>): ChatMessage[] {
  return messages.map(msg => ({
    role: msg.character === 'jobSeeker' ? 'user' : 'assistant',
    content: msg.content
  }));
}

 