import { Lightbulb, Brain } from 'lucide-react';

interface EmotionInsightProps {
  insight: string;
}

export function EmotionInsight({ insight }: EmotionInsightProps) {
  return (
    <div id="EmotionInsightCard" className="glass-effect-strong rounded-3xl border border-purple-500/30 p-6 shadow-xl hover-lift bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">What Caused This Emotion?</h3>
            <Lightbulb className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-purple-300 text-sm">AI Explainability</p>
        </div>
      </div>
      
      <div className="glass-effect rounded-2xl p-4 border border-white/10">
        <p className="text-white/90 leading-relaxed">
          {insight}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-purple-300">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        <span className="text-sm">AI-powered emotion analysis</span>
      </div>
    </div>
  );
}
