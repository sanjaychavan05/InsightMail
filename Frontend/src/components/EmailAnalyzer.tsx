import { useState } from 'react';
import { Sparkles, Zap, SendHorizonal } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { AnalysisCard } from './AnalysisCard';
import { SmartReply } from './SmartReply';
import { LoadingOverlay } from './LoadingOverlay';
import { RiskScore } from './RiskScore';
import { EmotionInsight } from './EmotionInsight';
import { analyzeEmail as analyzeEmailAPI } from '../services/api';
import { toast } from 'sonner';

interface AnalysisResult {
  intent: string;
  emotion: string;
  urgency: string;
  complianceFlags: string[];
  summary: string;
  actionItems: string[];
  suggestedReply: string;
  emotionInsight: string;
  riskScore: number;
  riskBreakdown: {
    emotionIntensity: number;
    priority: number;
    complianceRisk: number;
    escalationLikelihood: number;
  };
}

export function EmailAnalyzer() {
  const [emailInput, setEmailInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'formal' | 'empathetic' | 'friendly' | 'assertive'>('empathetic');

  const analyzeEmail = async () => {
    if (!emailInput.trim()) return;

    setIsLoading(true);

    try {
      const result = await analyzeEmailAPI({
        email: emailInput,
        tone: selectedTone,
      });

      const analysisData: AnalysisResult = {
        intent: result.intent,
        emotion: result.emotion,
        urgency: result.urgency,
        complianceFlags: result.compliance_flags.map(f => `${f.type}: ${f.detail}`),
        summary: result.summary,
        actionItems: result.action_items.map(a => a.task),
        suggestedReply: result.smart_reply,
        emotionInsight: result.emotion_reason,
        riskScore: result.risk_score,
        riskBreakdown: {
          emotionIntensity: result.risk_breakdown.emotion_intensity,
          priority: result.risk_breakdown.priority,
          complianceRisk: result.risk_breakdown.compliance_risk,
          escalationLikelihood: result.risk_breakdown.escalation_likelihood,
        },
      };

      setAnalysisResult(analysisData);
      toast.success('Email analyzed successfully');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-8 relative">
      {isLoading && <LoadingOverlay />}
      
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Email Analyzer
          </h1>
          <p className="text-white/60 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI-powered insights in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Email Input */}
          <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-effect-strong rounded-3xl p-6 hover-lift border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <SendHorizonal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">Email Input</h2>
                  <p className="text-white/60 text-sm">Paste the email content to analyze</p>
                </div>
              </div>

              <Textarea
                id="EmailInputTextArea"
                placeholder="Paste customer email here…"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="min-h-[400px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-purple-500/50 rounded-2xl"
              />

              <div className="mt-4 space-y-3">
                <Button
                  id="AnalyzeButton"
                  onClick={analyzeEmail}
                  disabled={!emailInput.trim() || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  Analyze Email with AI
                </Button>
                <p className="text-center text-white/40 text-sm flex items-center justify-center gap-2">
                  <Zap className="w-3 h-3" />
                  Powered by Google Gemini · Response time ~3–5 seconds
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Output */}
          <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-effect-strong rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">Analysis Results</h2>
                  <p className="text-white/60 text-sm">AI-generated insights and recommendations</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
                {!analysisResult ? (
                  <div className="glass-effect rounded-2xl p-12 text-center border border-white/5">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center animate-float">
                      <Sparkles className="w-10 h-10 text-purple-400" />
                    </div>
                    <p className="text-white/60">
                      Enter an email and click "Analyze Email" to see AI insights
                    </p>
                  </div>
                ) : (
                  <>
                    <RiskScore 
                      score={analysisResult.riskScore}
                      breakdown={analysisResult.riskBreakdown}
                    />

                    <AnalysisCard
                      id="IntentCard"
                      title="Intent"
                      content={analysisResult.intent}
                      type="default"
                    />

                    <AnalysisCard
                      id="EmotionCard"
                      title="Emotion / Sentiment"
                      content={analysisResult.emotion}
                      type="warning"
                    />

                    <EmotionInsight insight={analysisResult.emotionInsight} />

                    <AnalysisCard
                      id="UrgencyCard"
                      title="Urgency Level"
                      content={analysisResult.urgency}
                      type={analysisResult.urgency === 'High' ? 'danger' : analysisResult.urgency === 'Medium' ? 'warning' : 'success'}
                    />

                    <AnalysisCard
                      id="ComplianceCard"
                      title="Compliance Alerts"
                      content={analysisResult.complianceFlags}
                      type="info"
                    />

                    <AnalysisCard
                      id="ActionItemsCard"
                      title="Action Items"
                      content={analysisResult.actionItems}
                      type="default"
                    />

                    <AnalysisCard
                      id="SummaryCard"
                      title="Thread Summary"
                      content={analysisResult.summary}
                      type="default"
                    />

                    <SmartReply 
                      suggestedReply={analysisResult.suggestedReply}
                      selectedTone={selectedTone}
                      onToneChange={setSelectedTone}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
