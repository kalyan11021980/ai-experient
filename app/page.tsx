'use client';

import { useSimulationStore } from '@/lib/store';
import { CharacterConfiguration } from '@/components/CharacterConfiguration';
import { SimulationControls } from '@/components/SimulationControls';
import { ConversationArea } from '@/components/ConversationArea';
import { StageIndicator } from '@/components/StageIndicator';
import { EvaluationDisplay } from '@/components/EvaluationDisplay';

export default function InterviewSimulation() {
  const { currentStage } = useSimulationStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              AI Interview Simulation
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Experience a complete job interview process powered by different AI models with unique personalities
            </p>
          </div>
        </div>

        {/* Stage Indicator */}
        <div className="mb-6">
          <StageIndicator />
        </div>

        {/* Evaluation Results - Prominent Display */}
        {currentStage !== 'setup' && (
          <div className="mb-6">
            <EvaluationDisplay />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Left Panel - Configuration & Controls */}
          <div className="lg:col-span-1 space-y-6 min-w-0">
            <CharacterConfiguration />
            <SimulationControls />
          </div>

          {/* Right Panel - Conversation */}
          <div className="lg:col-span-2 min-w-0">
            <ConversationArea />
          </div>
        </div>
      </div>
    </div>
  );
}
