import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { AnalysisCard } from './AnalysisCard';
import { SmartReply } from './SmartReply';
import { LoadingOverlay } from './LoadingOverlay';
import { RiskScore } from './RiskScore';
import { EmotionInsight } from './EmotionInsight';

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

    // Simulate API call
    setTimeout(() => {
      // Mock response data
      const mockResult: AnalysisResult = {
        intent: 'Request for Refund',
        emotion: 'Frustrated',
        urgency: 'High',
        complianceFlags: ['GDPR Data Request', 'Financial Transaction'],
        summary: 'Customer is requesting a refund for a recent purchase due to product malfunction. They mention having contacted support multiple times without resolution.',
        actionItems: [
          'Process refund within 24 hours',
          'Investigate support ticket history',
          'Follow up on product quality issue',
          'Update customer on resolution timeline'
        ],
        suggestedReply: generateReplyByTone(selectedTone),
        emotionInsight: 'Frustration detected because the customer mentions "contacted support multiple times" and uses phrases like "still no response" indicating repeated failed attempts to resolve the issue. The language intensity and repeated emphasis on delays suggest growing impatience.',
        riskScore: 7.5,
        riskBreakdown: {
          emotionIntensity: 8,
          priority: 9,
          complianceRisk: 6,
          escalationLikelihood: 7
        }
      };

      setAnalysisResult(mockResult);
      setIsLoading(false);
    }, 3000);
  };

  const generateReplyByTone = (tone: string) => {
    const replies = {
      formal: `Dear Valued Customer,

Thank you for contacting us regarding your recent purchase. We acknowledge receipt of your refund request and sincerely apologize for the inconvenience this situation has caused.

Upon review of your case, we have determined that your refund request meets our policy requirements. The refund will be processed immediately and credited to your original payment method within 3-5 business days.

Furthermore, your feedback concerning product quality has been escalated to our Quality Assurance Department for thorough investigation and corrective action.

Should you require any additional assistance, please do not hesitate to contact our support team.

Respectfully,
Customer Support Team`,
      
      empathetic: `Dear Valued Customer,

Thank you for reaching out to us regarding your recent purchase. I sincerely apologize for the inconvenience you've experienced and for any delays in our response.

I have reviewed your case and I'm pleased to inform you that we will process your refund immediately. You can expect to see the funds returned to your original payment method within 3-5 business days.

Additionally, I've escalated your product quality concern to our quality assurance team to ensure this issue is addressed. Your feedback is invaluable in helping us improve our products and services.

If you have any further questions or concerns, please don't hesitate to reach out. We're here to help.

Best regards,
Customer Support Team`,
      
      friendly: `Hi there!

Thanks so much for getting in touch about your recent order. I'm really sorry to hear about the trouble you've had with your purchase – that's definitely not the experience we want you to have!

Good news though – I've approved your refund and it's being processed right now. You should see the money back in your account within 3-5 business days.

I've also passed your feedback along to our product team so they can look into this and make sure it doesn't happen again. We really appreciate you letting us know!

If there's anything else I can help you with, just let me know. I'm here for you!

Cheers,
Customer Support Team`,
      
      assertive: `Dear Customer,

We have received and reviewed your refund request.

Your refund has been approved and will be processed within 24 hours. Funds will be returned to your original payment method within 3-5 business days.

We have documented your product quality concern and it will be investigated by our quality assurance team.

For any further inquiries, please reference ticket #[TICKET_NUMBER] when contacting support.

Customer Support Team`
    };

    return replies[tone as keyof typeof replies] || replies.empathetic;
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
                  Powered by AI · Response time ~3–5 seconds
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
  );
}