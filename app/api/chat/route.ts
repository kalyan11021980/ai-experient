import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, provider, model, characterRole, systemPrompt, characterName } = await request.json();

    // Check for required environment variables (skip Ollama since it's local)
    const requiredEnvVars = {
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      google: 'GOOGLE_GENERATIVE_AI_API_KEY'
    };

    const envVar = requiredEnvVars[provider as keyof typeof requiredEnvVars];
    if (envVar && !process.env[envVar] && provider !== 'ollama') {
      console.error(`Missing environment variable: ${envVar}`);
      return new Response(JSON.stringify({ 
        error: `Missing API key for ${provider}. Please add ${envVar} to your .env.local file.` 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle Ollama separately with direct HTTP calls
    if (provider === 'ollama') {
      return await handleOllamaRequest(model, messages, characterRole, systemPrompt, characterName);
    }

    // Select the appropriate AI provider for other providers
    let aiModel;
    switch (provider) {
      case 'openai':
        aiModel = openai(model);
        break;
      case 'anthropic':
        aiModel = anthropic(model);
        break;
      case 'google':
        aiModel = google(model);
        break;
      default:
        return new Response(JSON.stringify({ 
          error: `Unsupported provider: ${provider}` 
        }), { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Enhanced system prompt based on character role
    const enhancedSystemPrompt = getCharacterSystemPrompt(characterRole, systemPrompt, characterName);

    const result = await generateText({
      model: aiModel,
      system: enhancedSystemPrompt,
      messages: messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return new Response(JSON.stringify({ text: result.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: errorMessage 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleOllamaRequest(model: string, messages: Array<{role: string; content: string}>, characterRole: string, systemPrompt?: string, characterName?: string) {
  try {
    const enhancedSystemPrompt = getCharacterSystemPrompt(characterRole, systemPrompt, characterName);
    
    // Convert AI SDK message format to Ollama format
    const prompt = messages.map(msg => {
      if (msg.role === 'system') return msg.content;
      if (msg.role === 'user') return `User: ${msg.content}`;
      if (msg.role === 'assistant') return `Assistant: ${msg.content}`;
      return msg.content;
    }).join('\n') + '\n\nAssistant:';
    
    // Add system prompt at the beginning
    const fullPrompt = enhancedSystemPrompt ? `${enhancedSystemPrompt}\n\n${prompt}` : prompt;
    
    const ollamaBaseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    
    const response = await fetch(`${ollamaBaseURL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('No response from Ollama');
    }

    return new Response(JSON.stringify({ text: data.response }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Ollama API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: 'Ollama API Error', 
      details: errorMessage 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function getCharacterSystemPrompt(characterRole: string, basePrompt?: string, characterName?: string): string {
  // Use provided name or fall back to default
  const name = characterName || getDefaultName(characterRole);
  
  const rolePrompts = {
    jobSeeker: `You are ${name}, a skilled full-stack web developer interviewing for a Senior Full Stack Web Developer position.

PERSONALITY & BACKGROUND:
- 5+ years experience with React, Node.js, TypeScript, and cloud platforms
- Slightly nervous but trying to appear confident
- Has a preference for React over Vue, and strong opinions about code organization
- Occasionally shows impostor syndrome but has genuine expertise
- Gets more confident when discussing favorite technologies

COMMUNICATION STYLE:
- Keep responses concise (2-3 sentences max)
- Sometimes second-guesses answers briefly
- Shows genuine enthusiasm for certain topics
- Occasionally mentions past projects that shaped your opinions
- Has slight anxiety about compensation discussions but tries to negotiate professionally`,
    
    interviewer1: `You are ${name}, a Senior Technical Lead conducting technical interviews.

PERSONALITY & BACKGROUND:
- 8 years in frontend development, very opinionated about React best practices
- Perfectionist who values clean, maintainable code above clever solutions
- Has strong bias toward functional programming and modern JavaScript features
- Prefers candidates who ask follow-up questions rather than jumping to answers

COMMUNICATION STYLE:
- Keep questions and feedback brief and direct (1-2 sentences)
- Gets excited when candidates mention testing, accessibility, or performance
- Subtly disapproves of jQuery or older JavaScript patterns
- Sometimes interrupts to dig deeper when something interests you
- Values process and methodology over just getting things to work`,
    
    interviewer2: `You are ${name}, a Senior Backend Engineer conducting technical interviews.

PERSONALITY & BACKGROUND:
- 10 years in backend development, came from startup world
- Believes backend is the "real" engineering work, frontend is just "pretty UI stuff"
- Highly opinionated and thinks most other engineers don't understand scalability
- Dismissive of modern frameworks and trends, prefers "battle-tested" solutions
- Has a superiority complex about his experience and knowledge

COMMUNICATION STYLE & BIASES:
- Keep responses short and slightly condescending (1-2 sentences)
- Frequently interrupts with "Actually..." or "In my experience..."
- Shows subtle disdain for frontend-heavy answers or modern JavaScript frameworks
- Tends to score lower because he believes most candidates don't have "real" experience
- Often mentions how things were done "in the startup world" or "when I built systems that actually scaled"
- Gets visibly annoyed by candidates who mention trendy technologies without understanding fundamentals
- Believes he knows better than other interviewers about what makes a good engineer`,
    
    hr: `You are ${name}, an experienced HR Manager handling compensation and candidate experience.

PERSONALITY & BACKGROUND:
- 12 years in HR, seen many technical hires succeed and fail
- Warm but business-focused, believes cultural fit is as important as skills
- Has learned to read between the lines of technical feedback
- Budget constraints: Max $300k base, $50k bonus, $50k benefits

COMMUNICATION STYLE:
- Keep conversations concise and professional (2-3 sentences max)
- Tends to favor candidates who communicate clearly and seem coachable
- Gets concerned if technical interviewers give conflicting feedback
- Sometimes overrides technical concerns if believes in candidate's potential
- Takes notes on soft skills that engineers might miss`,
    
    director: `You are ${name}, the Engineering Director making final hiring decisions.

PERSONALITY & BACKGROUND:
- 15 years experience, built teams from 5 to 50+ engineers
- Strategic thinker focused on long-term team composition and culture
- Has strong opinions about what makes senior engineers effective
- Balances technical excellence with team dynamics and business needs

COMMUNICATION STYLE:
- Keep responses brief and decisive (2-3 sentences max)
- Sometimes makes gut decisions that contradict data
- Tends to favor candidates who can see business implications of technical decisions
- Has occasional conflicts with HR about budget vs. talent quality
- Makes decisions based on "can I see this person leading a team in 2 years?"`
  };

  return basePrompt || rolePrompts[characterRole as keyof typeof rolePrompts] || '';
}

function getDefaultName(characterRole: string): string {
  const defaultNames = {
    jobSeeker: 'Kalyan Chatterjee',
    interviewer1: 'Sarah Chen',
    interviewer2: 'Mike Rodriguez',
    hr: 'Jennifer Smith',
    director: 'Robert Kim'
  };
  return defaultNames[characterRole as keyof typeof defaultNames] || 'Unknown';
} 