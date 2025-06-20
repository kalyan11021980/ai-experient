# AI Interview Simulation

An interactive simulation of a complete job interview process where various AI models play different roles: Job Seeker, Interviewer (x2), HR, and Director. This social AI experiment demonstrates how different AI model "personalities" and character traits influence decision-making in realistic business scenarios.

## Features

- **Multi-AI Character System**: Each role (Job Seeker, Interviewers, HR, Director) can use different AI models with distinct personalities and biases
- **Complete Interview Flow**: Technical interviews → HR discussion → Director approval
- **Real-time AI-Generated Content**: All conversations, evaluations, and decisions generated in real-time with no hardcoded responses
- **Human-like Decision Making**: Each AI character has unique personality traits, biases, and decision-making patterns that influence outcomes
- **Dynamic Compensation**: Budget-aware salary negotiations based on performance and character perspectives
- **Interactive Dashboard**: Real-time conversation view with auto-scroll and stage progression
- **Model Flexibility**: Support for OpenAI, Anthropic, Google, and local Ollama models
- **Realistic Corporate Workflow**: HR consults with Director before making compensation offers

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AI API Keys

Create a `.env.local` file in the project root:

```bash
# AI API Keys - Add your actual keys here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Optional: For Ollama local models
OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Get API Keys

- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic**: Get your API key from [Anthropic Console](https://console.anthropic.com/)
- **Google**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Ollama**: [Install Ollama](https://ollama.ai/) locally (optional)

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How to Use

1. **Configure Characters**: In the Character Configuration panel, select which AI provider and model each character should use
2. **Experiment with Models**: Try different model combinations to see how various AI "personalities" affect the interview outcomes
3. **Start Simulation**: Click "Start Simulation" to begin the interview process
4. **Watch the Flow**: Observe as AI characters conduct technical interviews, evaluate responses, negotiate compensation, and make hiring decisions
5. **Review Results**: See real-time evaluations, compensation packages, and final decisions in the evaluation panel
6. **Compare Outcomes**: Run multiple simulations with different model combinations to observe how AI model choice influences hiring decisions

## Technical Architecture

- **Frontend**: Next.js with React and Tailwind CSS
- **State Management**: Zustand for application state
- **AI Integration**: AI SDK with support for multiple providers
- **API Routes**: Next.js API routes for AI model orchestration
- **Simulation Engine**: Custom engine for managing interview flow and character interactions

## Interview Process

1. **Technical Round 1** (Questions 1-5): Frontend and fundamentals
2. **Technical Round 2** (Questions 6-10): Backend and architecture
3. **HR Discussion**: Compensation negotiation based on performance
4. **Director Approval**: Final hiring decision considering budget and fit

## Budget Constraints

- Maximum Base Salary: $300,000
- Maximum Bonus: $50,000
- Maximum Benefits: $50,000
- Total Package Cap: $400,000

## Character Personalities

Each AI character has distinct traits that influence their decision-making:

- **Alex (Job Seeker)**: Skilled but slightly nervous, shows genuine expertise mixed with occasional impostor syndrome
- **Sarah (Interviewer 1)**: Perfectionist frontend lead who values clean code, testing, and modern practices
- **Mike (Interviewer 2)**: Pragmatic backend engineer who prefers practical solutions over theoretical complexity
- **Jennifer (HR)**: Experienced manager focused on cultural fit, communication skills, and budget constraints
- **Robert (Director)**: Strategic thinker balancing technical excellence with team dynamics and business needs

## Social AI Experiment

This project explores how different AI models exhibit unique "personalities" when given specific character traits and biases. By switching models for different characters, you can observe:

- How different AI providers approach decision-making
- The impact of model choice on interview outcomes
- Variations in evaluation criteria and compensation decisions
- Realistic human-like biases and preferences in AI responses

## Development

This project demonstrates advanced AI orchestration patterns and can be extended with:

- Additional interview stages and character roles
- Custom evaluation criteria and scoring systems
- Integration with real HR systems and databases
- Multi-language support for global teams
- Historical data analysis and outcome tracking
- A/B testing different AI model combinations

## Contributing

This is a social AI experiment showcasing how different AI models exhibit unique behaviors in business processes. Feel free to experiment with different model combinations, modify character personalities, and observe how these changes affect hiring outcomes. The goal is to understand the nuances of AI decision-making in realistic scenarios.
