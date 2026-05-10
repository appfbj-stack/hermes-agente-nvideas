import OpenAI from 'openai';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// We use the OpenAI SDK configured for OpenRouter as recommended by their docs
export const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true, // For demo/MVP. In production, this should be an edge function!
  defaultHeaders: {
    'HTTP-Referer': window.location.origin, // Required by OpenRouter
    'X-Title': 'Hermes SaaS', // Required by OpenRouter
  },
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateChatResponse = async (messages: ChatMessage[], model: string = 'deepseek/deepseek-chat') => {
  try {
    const response = await openRouterClient.chat.completions.create({
      model: model,
      messages: messages,
      stream: false,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error;
  }
};

export const generateChatStream = async (
  messages: ChatMessage[], 
  onChunk: (chunk: string) => void,
  model: string = 'deepseek/deepseek-chat'
) => {
  try {
    const stream = await openRouterClient.chat.completions.create({
      model: model,
      messages: messages,
      stream: true,
    });
    
    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      onChunk(content);
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Error calling OpenRouter stream:', error);
    throw error;
  }
};
