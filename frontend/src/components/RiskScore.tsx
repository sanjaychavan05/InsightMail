import { AlertTriangle, TrendingUp, Brain, Flag, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RiskScoreProps {
  score: number;
  breakdown: {
    emotion_intensity: number;
    priority: number;
    compliance_risk: number;
    escalation_likelihood: number;
  };
}

export function RiskScore({ score, breakdown }: RiskScoreProps) {
  // Animated counter state
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate score on mount or when score changes
  useEffect(() => {
    setIsAnimating(true);
    let start = 0;
    const increment = score / 30;
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
        setIsAnimating(false);
      } else {
        setDisplayScore(start);
      }
    }, 20);
    return () => {
      clearInterval(timer);
      setIsAnimating(false);
    };
  }, [score]);

  const getRiskLevel = () => {
    if (score >= 80) return { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (score >= 60) return { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (score >= 40) return { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const riskLevel = getRiskLevel();
  const percentage = score;

  // Breakdown configuration with icons and tooltips
  const breakdownConfig = {
    emotion_intensity: {
      icon: Brain,
      label: 'Emotion Intensity',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500',
      tooltip: 'Measures emotional intensity from neutral (0) to highly emotional (100)'
    },
    priority: {
      icon: ArrowUpRight,
      label: 'Priority',
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500',
      tooltip: 'Urgency level from low priority (0) to critical/immediate (100)'
    },
    compliance_risk: {
      icon: Flag,
      label: 'Compliance Risk',
      gradient: 'from-orange-500 to-red-500',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500',
      tooltip: 'Risk of policy violations, PII exposure, or regulatory issues (0-100)'
    },
    escalation_likelihood: {
      icon: AlertCircle,
      label: 'Escalation Risk',
      gradient: 'from-red-500 to-pink-500',
      color: 'text-red-400',
      bgColor: 'bg-red-500',
      tooltip: 'Likelihood of requiring management intervention or escalation (0-100)'
    }
  };

  return (
    <div 
      id="RiskScoreCard" 
      className={`bg-white rounded-xl border-2 ${riskLevel.border} p-6 shadow-lg animate-slideIn opacity-0`}
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${riskLevel.bg} rounded-lg flex items-center justify-center`}>
            <AlertTriangle className={`w-6 h-6 ${riskLevel.color}`} />
          </div>
          <div>
            <h3 className="text-gray-900">Risk Score</h3>
            <p className={`${riskLevel.color}`}>{riskLevel.label} Risk</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${riskLevel.color} ${isAnimating ? 'animate-pulse' : ''}`}>
            {displayScore.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-500">Risk Level</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              score >= 80 ? 'bg-red-600' :
              score >= 60 ? 'bg-orange-500' :
              score >= 40 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Risk Breakdown:</p>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(breakdown).map(([key, value]) => {
            const config = breakdownConfig[key as keyof typeof breakdownConfig];
            if (!config) return null;
            
            const Icon = config.icon;
            const percentage = value?.toFixed(0) || '0';
            
            return (
              <div key={key} className="space-y-1 group">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${config.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-600" title={config.tooltip}>
                      {config.label}
                    </span>
                  </div>
                  <span className={`font-medium ${config.color} group-hover:scale-105 transition-transform`}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-full ${config.bgColor} rounded-full transition-all`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manager Insight */}
      {score >= 70 && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-amber-800">
            <span className="font-medium">Manager Alert:</span> This email requires immediate attention and potential escalation to senior support.
          </p>
        </div>
      )}
    </div>
  );
}
