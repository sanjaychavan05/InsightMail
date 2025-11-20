import { AlertTriangle, TrendingUp } from 'lucide-react';

interface RiskScoreProps {
  score: number;
  breakdown: {
    legal_risk: number;
    financial_risk: number;
    reputational_risk: number;
    operational_risk: number;
  };
}

export function RiskScore({ score, breakdown }: RiskScoreProps) {
  const getRiskLevel = () => {
    if (score >= 0.8) return { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (score >= 0.6) return { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (score >= 0.4) return { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const riskLevel = getRiskLevel();
  const percentage = score * 100;

  return (
    <div id="RiskScoreCard" className={`bg-white rounded-xl border-2 ${riskLevel.border} p-6 shadow-lg`}>
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
          <div className={`text-3xl font-bold ${riskLevel.color}`}>{(score * 100).toFixed(0)}%</div>
          <p className="text-sm text-gray-500">Risk Level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              score >= 0.8 ? 'bg-red-600' :
              score >= 0.6 ? 'bg-orange-500' :
              score >= 0.4 ? 'bg-yellow-500' :
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
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Legal Risk</span>
              <span className="font-medium text-gray-900">{(breakdown.legal_risk * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${breakdown.legal_risk * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Financial Risk</span>
              <span className="font-medium text-gray-900">{(breakdown.financial_risk * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${breakdown.financial_risk * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Reputational Risk</span>
              <span className="font-medium text-gray-900">{(breakdown.reputational_risk * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${breakdown.reputational_risk * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Operational Risk</span>
              <span className="font-medium text-gray-900">{(breakdown.operational_risk * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-full bg-red-500 rounded-full transition-all"
                style={{ width: `${breakdown.operational_risk * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manager Insight */}
      {score >= 0.7 && (
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
