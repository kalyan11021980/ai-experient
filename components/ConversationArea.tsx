'use client';

import { useSimulationStore } from '@/lib/store';
import { CharacterRole } from '@/lib/types';
import { useEffect, useRef } from 'react';

const characterColors: Record<CharacterRole, string> = {
  jobSeeker: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm',
  interviewer1: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm',
  interviewer2: 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 shadow-sm',
  hr: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm',
  director: 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 shadow-sm'
};

const characterLabels: Record<CharacterRole, string> = {
  jobSeeker: 'Job Seeker',
  interviewer1: 'Interviewer 1',
  interviewer2: 'Interviewer 2',
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

export function ConversationArea() {
  const { messages, characters, currentStage } = useSimulationStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const visibleMessages = messages.filter(message => !message.isInternal);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [visibleMessages.length]);

  const clearMessages = () => {
    if (confirm('Are you sure you want to clear all messages? This will reset the conversation.')) {
      // Clear just the messages by setting messages to empty array
      useSimulationStore.setState({ messages: [] });
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 h-[600px] flex flex-col w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">💬 Live Conversation</h2>
        <div className="flex items-center gap-4">
          {currentStage === 'setup' && (
            <div className="text-sm text-gray-500">
              Configure characters and start simulation to begin
            </div>
          )}
          <div className="flex items-center gap-2">
            {visibleMessages.length > 0 && (
              <button
                onClick={clearMessages}
                className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all duration-200 hover:shadow-sm"
                title="Clear all messages"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {visibleMessages.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            <div className="text-6xl mb-4 opacity-50">🤖</div>
            <h3 className="text-lg font-medium mb-2">Ready to Begin</h3>
            <p className="text-sm">Configure AI characters and start the simulation to watch the interview unfold</p>
          </div>
        ) : (
          visibleMessages.map((message) => {
            const character = characters[message.character];
            
            return (
              <div key={message.id} className="space-y-2">
                <div className={`p-4 rounded-xl border-2 ${characterColors[message.character]} hover:shadow-md transition-all duration-200`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-sm">{getCharacterEmoji(message.character)}</span>
                      {character.name} 
                      <span className="text-xs font-normal text-slate-500 bg-white/50 px-2 py-1 rounded-full">
                        {characterLabels[message.character]}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 bg-white/30 px-2 py-1 rounded-lg">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {/* Message content */}
                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
                    {message.content || (
                      <div className="text-red-500 italic">
                        [Empty message - please check console for errors]
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {currentStage !== 'setup' && currentStage !== 'completed' && (
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 text-sm text-slate-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
              🤖 AI characters are thinking...
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 