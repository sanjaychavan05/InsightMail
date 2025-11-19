import { Lightbulb, Brain } from 'lucide-react';

interface EmotionInsightProps {
  insight: string;
}

export function EmotionInsight({ insight }: EmotionInsightProps) {
  return (
    <div id="EmotionInsightCard" className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900">What Caused This Emotion?</h3>
            <Lightbulb className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-purple-600">AI Explainability</p>
        </div>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
        <p className="text-gray-700 leading-relaxed">
          {insight}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-purple-700">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        <span className="text-sm">AI-powered emotion analysis</span>
      </div>
    </div>
  );
}
