'use client';

import { useSimulationStore } from '@/lib/store';
import { SimulationStage } from '@/lib/types';

const stageLabels: Record<SimulationStage, string> = {
  setup: 'Setup Configuration',
  technical1: 'Technical Interview - Round 1',
  technical2: 'Technical Interview - Round 2',
  hrDiscussion: 'HR Discussion',
  directorApproval: 'Director Approval',
  completed: 'Simulation Complete',
  paused: 'Simulation Paused'
};

const stageOrder: SimulationStage[] = ['setup', 'technical1', 'technical2', 'hrDiscussion', 'directorApproval', 'completed'];

export function StageIndicator() {
  const { currentStage } = useSimulationStore();
  
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">🚀 Simulation Progress</h2>
      
      <div className="relative flex items-center justify-between overflow-hidden">
        {stageOrder.map((stage, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={stage} className="flex flex-col items-center flex-1 relative z-10">
              {/* Circle indicator */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white ring-4 ring-blue-200 transform scale-110' 
                  : isCompleted 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                    : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-600'
                }
              `}>
                {isCompleted ? '✓' : index + 1}
              </div>
              
              {/* Label */}
              <div className={`
                mt-3 text-xs text-center leading-tight px-1
                ${isActive ? 'text-blue-600 font-semibold' : isCompleted ? 'text-emerald-600 font-medium' : 'text-slate-500'}
              `}>
                {stageLabels[stage]}
              </div>
            </div>
          );
        })}
        
        {/* Background connector line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full" style={{ zIndex: 1 }} />
        
        {/* Progress line */}
        <div 
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transition-all duration-500" 
          style={{ 
            width: `${Math.max(0, (currentIndex / (stageOrder.length - 1)) * 100)}%`,
            zIndex: 2 
          }} 
        />
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
        <div className="text-sm text-slate-600">
          <strong className="text-slate-800">Current Stage:</strong> 
          <span className="font-semibold text-blue-600 ml-2">{stageLabels[currentStage]}</span>
        </div>
      </div>
    </div>
  );
} 