import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AnalysisCardProps {
  id?: string;
  title: string;
  content: string | string[];
  type?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export function AnalysisCard({ id, title, content, type = 'default' }: AnalysisCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          badge: 'bg-green-500/20 text-green-300 border-green-500/30',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'warning':
        return {
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case 'danger':
        return {
          badge: 'bg-red-500/20 text-red-300 border-red-500/30',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case 'info':
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          icon: <Info className="w-4 h-4" />,
        };
      default:
        return {
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          icon: null,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div id={id} className="glass-effect rounded-2xl border border-white/10 p-6 shadow-xl hover-lift">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      
      {Array.isArray(content) ? (
        <div className="space-y-2">
          {content.map((item, index) => (
            <div
              key={index}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${styles.badge} mr-2 mb-2`}
            >
              {styles.icon}
              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${styles.badge}`}>
          {styles.icon}
          <span>{content}</span>
        </div>
      )}
    </div>
  );
}
