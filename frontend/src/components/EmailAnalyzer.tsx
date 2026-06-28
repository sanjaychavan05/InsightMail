import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { AnalysisCard } from './AnalysisCard';
import { SmartReply } from './SmartReply';
import { LoadingOverlay } from './LoadingOverlay';
import { RiskScore } from './RiskScore';
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
    legal_risk: number;
    financial_risk: number;
    reputational_risk: number;
    operational_risk: number;
  };
  ragContextUsed: boolean;
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
      // Call real backend API
      const result = await analyzeEmailAPI({
        email: emailInput,
        tone: selectedTone,
      });

      console.log('API Response:', result);
      console.log('Compliance Flags:', result.compliance_flags);
      console.log('Action Items:', result.action_items);

      // Map API response to frontend format
      const analysisData: AnalysisResult = {
        intent: result.intent,
        emotion: result.emotion,
        urgency: result.urgency,
        complianceFlags: result.compliance_flags,
        summary: result.summary,
        actionItems: result.action_items,
        suggestedReply: result.smart_reply,
        emotionInsight: result.emotion_reason,
        riskScore: result.risk_score,
        riskBreakdown: {
          legal_risk: result.risk_breakdown.legal_risk,
          financial_risk: result.risk_breakdown.financial_risk,
          reputational_risk: result.risk_breakdown.reputational_risk,
          operational_risk: result.risk_breakdown.operational_risk,
        },
        ragContextUsed: result.rag_context_used,
      };

      console.log('Mapped Analysis Data:', analysisData);
      console.log('Mapped Compliance Flags:', analysisData.complianceFlags);
      console.log('Mapped Action Items:', analysisData.actionItems);

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
    <div className="h-full p-8">
      {isLoading && <LoadingOverlay />}
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column - Email Input */}
          <div className="space-y-4">
            <div>
              <h2 className="text-gray-900 mb-1">Email Input</h2>
              <p className="text-gray-500">Paste the customer email to analyze</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <Textarea
                id="EmailInputTextArea"
                placeholder="Paste customer email here…"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="min-h-[400px] resize-none"
              />

              <div className="space-y-3">
                <Button
                  id="AnalyzeButton"
                  onClick={analyzeEmail}
                  disabled={!emailInput.trim() || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Email
                </Button>
                <p className="text-center text-gray-400">
                  Powered by AI  
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Output */}
          <div className="space-y-4">
            <div>
              <h2 className="text-gray-900 mb-1">Analysis Results</h2>
              <p className="text-gray-500">AI-generated insights and recommendations</p>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {!analysisResult ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Enter an email and click "Analyze Email" to see results
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
  );
}