'use client';

import { useSimulationStore } from '@/lib/store';
import { SimulationEngine } from '@/lib/simulation';

export function SimulationControls() {
  const { currentStage, setStage, addMessage } = useSimulationStore();
  const simulationEngine = new SimulationEngine();

  const startSimulation = async () => {
    console.log('Starting real AI simulation...', { currentStage });
    try {
      await simulationEngine.startSimulation();
      console.log('Simulation started successfully');
    } catch (error) {
      console.error('Failed to start simulation:', error);
      // Add an error message to help debug
      addMessage({
        character: 'interviewer1',
        content: `Error starting simulation: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API keys in .env.local file.`
      });
    }
  };

  const pauseSimulation = () => {
    setStage('paused');
  };

  const resetSimulation = () => {
    if (confirm('Are you sure you want to reset the simulation? All progress will be lost.')) {
      console.log('Resetting simulation...');
      useSimulationStore.setState({
        currentStage: 'setup',
        messages: [],
        currentQuestionIndex: 0,
        evaluations: [],
        compensationPackage: undefined,
        finalDecision: undefined,
        appointmentLetter: undefined
      });
      console.log('Simulation reset complete');
    }
  };

  const getButtonText = () => {
    switch (currentStage) {
      case 'setup':
        return 'Start AI Interview';
      case 'paused':
        return 'Resume Interview';
      default:
        return 'Interview Running...';
    }
  };

  const getButtonAction = () => {
    switch (currentStage) {
      case 'setup':
        return startSimulation;
      case 'paused':
        return startSimulation;
      default:
        return undefined;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">🎮 Interview Controls</h2>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={getButtonAction()}
            disabled={currentStage !== 'setup' && currentStage !== 'paused'}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
              currentStage === 'setup' || currentStage === 'paused'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-105'
                : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {getButtonText()}
          </button>
          
          {currentStage !== 'setup' && currentStage !== 'completed' && (
            <button
              onClick={pauseSimulation}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md transform hover:scale-105"
            >
              ⏸️ Pause
            </button>
          )}
        </div>
        
        <button
          onClick={resetSimulation}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md transform hover:scale-105"
        >
          🔄 Reset Interview
        </button>
        
        <div className="text-sm text-slate-600">
          <div className="mb-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <strong className="text-slate-800">Status:</strong> <span className="text-slate-600">{currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}</span>
          </div>
          {currentStage === 'setup' && (
            <div className="text-xs text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-400">
              <div className="font-semibold text-blue-800 mb-2">📋 Ready to Begin</div>
              <div className="space-y-1 text-blue-600">
                <div>• Configure AI models for each character</div>
                <div>• Ensure API keys are set in .env.local file</div>
                <div>• Check browser console for any errors</div>
              </div>
            </div>
          )}
          {(currentStage === 'technical1' || currentStage === 'technical2') && (
            <div className="text-xs text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border-l-4 border-emerald-400">
              <div className="font-semibold text-emerald-800 mb-2">🎯 Interview in Progress</div>
              <div className="text-emerald-600">AI characters are conducting the interview. This may take a few moments as they generate responses.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 