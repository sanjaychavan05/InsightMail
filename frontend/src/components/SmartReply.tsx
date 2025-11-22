import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface SmartReplyProps {
  suggestedReply: string;
  selectedTone: 'formal' | 'empathetic' | 'friendly' | 'assertive';
  onToneChange: (tone: 'formal' | 'empathetic' | 'friendly' | 'assertive') => void;
}

export function SmartReply({ suggestedReply, selectedTone, onToneChange }: SmartReplyProps) {
  const [replyText, setReplyText] = useState(suggestedReply);
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Update reply text when suggestedReply changes
  useEffect(() => {
    setReplyText(suggestedReply);
  }, [suggestedReply]);

  const tones = [
    { value: 'formal' as const, label: 'Formal', description: 'Professional and structured' },
    { value: 'empathetic' as const, label: 'Empathetic', description: 'Understanding and caring' },
    { value: 'friendly' as const, label: 'Friendly', description: 'Casual and warm' },
    { value: 'assertive' as const, label: 'Assertive', description: 'Direct and confident' },
  ];

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(replyText);
      setIsCopied(true);
      toast.success('Reply copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy reply');
    }
  };

  const regenerateReply = async () => {
    setIsRegenerating(true);

    // Simulate API call to regenerate
    setTimeout(() => {
      const alternatives = {
        formal: [
          `Dear Valued Customer,

Thank you for contacting us regarding your recent purchase. We acknowledge receipt of your refund request and sincerely apologize for the inconvenience this situation has caused.

Upon review of your case, we have determined that your refund request meets our policy requirements. The refund will be processed immediately and credited to your original payment method within 3-5 business days.

Furthermore, your feedback concerning product quality has been escalated to our Quality Assurance Department for thorough investigation and corrective action.

Should you require any additional assistance, please do not hesitate to contact our support team.

Respectfully,
Customer Support Team`,
          `Dear Valued Customer,

We are in receipt of your correspondence regarding the refund request for your recent purchase.

Please be advised that your request has been approved. The refund amount will be credited to your original payment method within 3-5 business days from the date of this communication.

Your concerns regarding product quality have been duly noted and forwarded to the appropriate department for review and resolution.

For further assistance, you may contact our customer service department during business hours.

Sincerely,
Customer Support Team`
        ],
        empathetic: [
          `Dear Valued Customer,

Thank you for reaching out to us regarding your recent purchase. I sincerely apologize for the inconvenience you've experienced and for any delays in our response.

I have reviewed your case and I'm pleased to inform you that we will process your refund immediately. You can expect to see the funds returned to your original payment method within 3-5 business days.

Additionally, I've escalated your product quality concern to our quality assurance team to ensure this issue is addressed. Your feedback is invaluable in helping us improve our products and services.

If you have any further questions or concerns, please don't hesitate to reach out. We're here to help.

Best regards,
Customer Support Team`,
          `Dear Customer,

I appreciate you taking the time to contact us about your recent purchase. I'm truly sorry for the trouble you've encountered and any frustration this has caused.

I've personally reviewed your case and am happy to confirm that your refund will be processed today. Please allow 3-5 business days for the amount to reflect in your account.

We take product quality seriously, and I've forwarded your feedback to our product team for immediate review. Your insights help us maintain the high standards our customers deserve.

Should you need any additional assistance, I'm here to help.

Warm regards,
Customer Support Team`
        ],
        friendly: [
          `Hi there!

Thanks so much for getting in touch about your recent order. I'm really sorry to hear about the trouble you've had with your purchase – that's definitely not the experience we want you to have!

Good news though – I've approved your refund and it's being processed right now. You should see the money back in your account within 3-5 business days.

I've also passed your feedback along to our product team so they can look into this and make sure it doesn't happen again. We really appreciate you letting us know!

If there's anything else I can help you with, just let me know. I'm here for you!

Cheers,
Customer Support Team`,
          `Hey!

Thanks for reaching out! I'm so sorry about the issues with your order – that's not cool at all, and I totally understand your frustration.

I've got some good news: your refund is all set and will be headed back to you within 3-5 days. 

I've also flagged your feedback with our product team because we definitely want to fix this. Thanks for being patient with us!

Hit me up if you need anything else – happy to help!

Take care,
Customer Support Team`
        ],
        assertive: [
          `Dear Customer,

We have received and reviewed your refund request.

Your refund has been approved and will be processed within 24 hours. Funds will be returned to your original payment method within 3-5 business days.

We have documented your product quality concern and it will be investigated by our quality assurance team.

For any further inquiries, please reference ticket #[TICKET_NUMBER] when contacting support.

Customer Support Team`,
          `Dear Customer,

Your refund request has been processed.

Refund Amount: [AMOUNT]
Processing Time: 24 hours
Return Method: Original payment method
Expected Arrival: 3-5 business days

Your product feedback has been logged. Case #[CASE_NUMBER].

Contact support with your case number for status updates.

Customer Support Team`
        ]
      };

      const toneAlternatives = alternatives[selectedTone];
      const randomReply = toneAlternatives[Math.floor(Math.random() * toneAlternatives.length)];
      setReplyText(randomReply);
      setIsRegenerating(false);
      toast.success('Reply regenerated with ' + selectedTone + ' tone');
    }, 2000);
  };

  const handleToneChange = (tone: 'formal' | 'empathetic' | 'friendly' | 'assertive') => {
    onToneChange(tone);
    toast.success(`Tone changed to ${tone}`);
  };

  return (
    <div id="SmartReplySection" className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900">AI-Generated Reply</h3>
      </div>

      {/* Tone Selection */}
      <div className="space-y-2">
        <label className="text-gray-700">Reply Tone</label>
        <div className="grid grid-cols-2 gap-2">
          {tones.map((tone) => (
            <button
              key={tone.value}
              onClick={() => handleToneChange(tone.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedTone === tone.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`${selectedTone === tone.value ? 'text-blue-900' : 'text-gray-900'}`}>
                {tone.label}
              </div>
              <div className={`${selectedTone === tone.value ? 'text-blue-600' : 'text-gray-500'}`}>
                {tone.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Textarea
        id="SmartReplyBox"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="min-h-[300px] resize-none"
        placeholder="Your AI-generated reply will appear here."
      />

      <div className="flex gap-3">
        <Button
          onClick={copyReply}
          variant="outline"
          className="flex-1"
          disabled={isCopied}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Reply
            </>
          )}
        </Button>

        <Button
          onClick={regenerateReply}
          variant="outline"
          className="flex-1"
          disabled={isRegenerating}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
          Regenerate Reply
        </Button>
      </div>
    </div>
  );
}