import { AlertTriangle, TrendingUp } from 'lucide-react';

interface RiskScoreProps {
  score: number;
  breakdown: {
    emotionIntensity: number;
    priority: number;
    complianceRisk: number;
    escalationLikelihood: number;
  };
}

export function RiskScore({ score, breakdown }: RiskScoreProps) {
  const getRiskLevel = () => {
    if (score >= 8) return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', gradient: 'from-red-500 to-orange-500' };
    if (score >= 6) return { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', gradient: 'from-orange-500 to-yellow-500' };
    if (score >= 4) return { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', gradient: 'from-yellow-500 to-green-500' };
    return { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', gradient: 'from-green-500 to-emerald-500' };
  };

  const riskLevel = getRiskLevel();
  const percentage = (score / 10) * 100;

  return (
    <div id="RiskScoreCard" className={`glass-effect rounded-3xl border ${riskLevel.border} p-6 shadow-xl hover-lift`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${riskLevel.bg} rounded-xl flex items-center justify-center border ${riskLevel.border}`}>
            <AlertTriangle className={`w-6 h-6 ${riskLevel.color}`} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Risk Score</h3>
            <p className={`${riskLevel.color} font-medium`}>{riskLevel.label} Risk</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${riskLevel.color}`}>{score.toFixed(1)}</div>
          <p className="text-white/60 text-sm">out of 10</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 bg-gradient-to-r ${riskLevel.gradient} shadow-lg`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <p className="text-white/80 font-medium">Risk Breakdown:</p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Emotion Intensity</span>
              <span className="text-blue-400 font-semibold">{breakdown.emotionIntensity}/10</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all shadow-lg"
                style={{ width: `${(breakdown.emotionIntensity / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Priority</span>
              <span className="text-purple-400 font-semibold">{breakdown.priority}/10</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all shadow-lg"
                style={{ width: `${(breakdown.priority / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Compliance Risk</span>
              <span className="text-orange-400 font-semibold">{breakdown.complianceRisk}/10</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all shadow-lg"
                style={{ width: `${(breakdown.complianceRisk / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Escalation Risk</span>
              <span className="text-red-400 font-semibold">{breakdown.escalationLikelihood}/10</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all shadow-lg"
                style={{ width: `${(breakdown.escalationLikelihood / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manager Insight */}
      {score >= 7 && (
        <div className="mt-4 flex items-start gap-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
          <TrendingUp className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-amber-200">
            <span className="font-semibold">Manager Alert:</span> This email requires immediate attention and potential escalation to senior support.
          </p>
        </div>
      )}
    </div>
  );
}
