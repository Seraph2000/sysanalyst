'use client';

import { useState } from 'react';
import { AnalysisMode, ConversationStep } from '@/lib/types';
import { getModeConfig } from '@/config/modes';
import { saveAnalysis } from '@/lib/storage';
import { useAuth } from './AuthProvider';
import ModeSelector from './ModeSelector';
import AnalysisOutput from './AnalysisOutput';

export default function ChatInterface() {
  const { user } = useAuth();
  const [mode, setMode] = useState<AnalysisMode>('analyse-mvp');
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modeConfig = getModeConfig(mode);
  const steps: ConversationStep[] = modeConfig.steps;
  const isComplete = currentStep >= steps.length;

  function handleModeSelected() {
    setCurrentStep(0);
    setAnswers({});
    setAnalysisResult(null);
    setError(null);
  }

  function handleNext() {
    if (!currentAnswer.trim()) return;

    const step = steps[currentStep];
    const newAnswers = { ...answers, [step.question]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentStep + 1 >= steps.length) {
      setCurrentStep(currentStep + 1);
      runAnalysis(newAnswers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  }

  async function runAnalysis(finalAnswers: Record<string, string>) {
    setIsAnalysing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, answers: finalAnswers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResult(data.result);

      // Save to Supabase
      if (user) {
        const firstAnswer = Object.values(finalAnswers)[0] || 'Untitled';
        const title = firstAnswer.slice(0, 60) + (firstAnswer.length > 60 ? '...' : '');
        await saveAnalysis(user.id, title, mode, data.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalysing(false);
    }
  }

  function handleStartOver() {
    setCurrentStep(-1);
    setAnswers({});
    setCurrentAnswer('');
    setAnalysisResult(null);
    setError(null);
    setMode('analyse-mvp');
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Seraphina</h1>
        <p className="text-stone-500 mt-1">Your Systems Analyst</p>
      </div>

      {currentStep === -1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-stone-700 mb-1">
              What would you like to do?
            </h2>
            <p className="text-sm text-stone-400">
              Choose an analysis mode to get started.
            </p>
          </div>
          <ModeSelector selected={mode} onSelect={setMode} />
          <button
            onClick={handleModeSelected}
            className="w-full py-3 px-6 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            Let&apos;s begin
          </button>
        </div>
      )}

      {currentStep >= 0 && !isComplete && (
        <div className="space-y-6">
          {Object.entries(answers).map(([question, answer]) => (
            <div key={question} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 text-sm font-medium">S</span>
                </div>
                <p className="text-stone-700 font-medium pt-1">{question}</p>
              </div>
              <div className="ml-11 bg-stone-50 rounded-xl p-4 text-stone-600">
                {answer}
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-violet-600 text-sm font-medium">S</span>
            </div>
            <p className="text-stone-700 font-medium pt-1">
              {steps[currentStep].question}
            </p>
          </div>

          <div className="ml-11 space-y-3">
            <textarea
              id="chat-input"
              name="chat-input"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={steps[currentStep].placeholder}
              rows={4}
              className="w-full p-4 border border-stone-200 rounded-xl text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 resize-none"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                className="py-2 px-6 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentStep + 1 === steps.length ? 'Generate Analysis' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAnalysing && (
        <div className="text-center py-16 space-y-4">
          <div className="inline-flex items-center gap-3 text-stone-500">
            <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            <span>Seraphina is analysing your input...</span>
          </div>
          <p className="text-sm text-stone-400">This usually takes 10-20 seconds.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={handleStartOver}
            className="text-red-600 underline text-sm mt-2"
          >
            Start over
          </button>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-800">
              Analysis Complete
            </h2>
            <button
              onClick={handleStartOver}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              New Analysis
            </button>
          </div>
          <AnalysisOutput rawMarkdown={analysisResult} />
        </div>
      )}
    </div>
  );
}
