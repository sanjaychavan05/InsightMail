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
    if (score >= 80) return { label: 'Critical', color: 'text-red-400', gradientFrom: 'from-red-500', gradientTo: 'to-orange-500' };
    if (score >= 60) return { label: 'High', color: 'text-orange-400', gradientFrom: 'from-orange-500', gradientTo: 'to-yellow-500' };
    if (score >= 40) return { label: 'Medium', color: 'text-yellow-400', gradientFrom: 'from-yellow-500', gradientTo: 'to-green-500' };
    return { label: 'Low', color: 'text-green-400', gradientFrom: 'from-green-500', gradientTo: 'to-emerald-500' };
  };

  const riskLevel = getRiskLevel();

  const riskLevel = getRiskLevel();

  return (
    <div id="RiskScoreCard" className="glass-effect-strong rounded-3xl p-6 border border-white/10 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${riskLevel.gradientFrom} ${riskLevel.gradientTo} flex items-center justify-center`}>
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Risk Score</h3>
            <p className={`${riskLevel.color} font-medium`}>{riskLevel.label} Risk</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${riskLevel.color}`}>{score.toFixed(0)}%</div>
          <p className="text-sm text-white/50">Risk Level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-500 bg-gradient-to-r ${riskLevel.gradientFrom} ${riskLevel.gradientTo} shadow-lg`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-white/80">Risk Breakdown:</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Emotion Intensity</span>
              <span className="font-semibold text-blue-400">{breakdown.emotionIntensity.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all shadow-lg"
                style={{ width: `${Math.min(breakdown.emotionIntensity, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Priority</span>
              <span className="font-semibold text-purple-400">{breakdown.priority.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all shadow-lg"
                style={{ width: `${Math.min(breakdown.priority, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Compliance Risk</span>
              <span className="font-semibold text-orange-400">{breakdown.complianceRisk.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all shadow-lg"
                style={{ width: `${Math.min(breakdown.complianceRisk, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Escalation Risk</span>
              <span className="font-semibold text-red-400">{breakdown.escalationLikelihood.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all shadow-lg"
                style={{ width: `${Math.min(breakdown.escalationLikelihood, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manager Insight */}
      {score >= 70 && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-sm">
          <TrendingUp className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-amber-200 text-sm">
            <span className="font-semibold">Manager Alert:</span> This email requires immediate attention and potential escalation to senior support.
          </p>
        </div>
      )}
    </div>
  );
}
