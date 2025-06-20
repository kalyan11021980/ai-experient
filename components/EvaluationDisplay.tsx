'use client';

import { useSimulationStore } from '@/lib/store';

export function EvaluationDisplay() {
  const { 
    evaluations, 
    compensationPackage, 
    finalDecision,
    currentStage 
  } = useSimulationStore();

  if (currentStage === 'setup') {
    return null;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">📊 Evaluation & Results</h2>
      
      <div className="space-y-4">
        {evaluations.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span>🎯</span> Technical Evaluations
            </h3>
            <div className="space-y-3">
              {evaluations.map((evaluation) => (
                <div key={`${evaluation.character}-${evaluation.questionId}`} 
                     className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-white/50 to-slate-50/50 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Question {evaluation.questionId}
                    </span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full shadow-sm ${
                      evaluation.score >= 8 ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700' :
                      evaluation.score >= 6 ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700' :
                      'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                    }`}>
                      {evaluation.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{evaluation.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {compensationPackage && (
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span>💰</span> Compensation Package
            </h3>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 space-y-3 border border-emerald-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Base Salary:</span>
                <span className="font-semibold text-slate-800">${compensationPackage.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Bonus:</span>
                <span className="font-semibold text-slate-800">${compensationPackage.bonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Benefits:</span>
                <span className="font-semibold text-slate-800">${compensationPackage.benefits.toLocaleString()}</span>
              </div>
              <div className="border-t border-emerald-200 pt-3 flex justify-between font-bold text-lg">
                <span className="text-slate-700">Total Package:</span>
                <span className="text-emerald-600">${compensationPackage.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {finalDecision && (
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span>🎯</span> Final Decision
            </h3>
            <div className={`p-4 rounded-xl border-2 shadow-lg ${
              finalDecision === 'approved' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
            }`}>
              <span className={`font-bold text-xl flex items-center gap-2 ${
                finalDecision === 'approved' ? 'text-green-700' : 'text-red-700'
              }`}>
                {finalDecision === 'approved' ? '🎉 APPROVED' : '❌ REJECTED'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 