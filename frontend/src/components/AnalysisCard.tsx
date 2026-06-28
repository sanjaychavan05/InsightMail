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
          badge: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'warning':
        return {
          badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case 'danger':
        return {
          badge: 'bg-red-100 text-red-700 border-red-200',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case 'info':
        return {
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Info className="w-4 h-4" />,
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: null,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div id={id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-gray-900 mb-3">{title}</h3>
      
      {Array.isArray(content) ? (
        content.length > 0 ? (
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
          <div className="text-sm text-gray-500 italic">
            No items found
          </div>
        )
      ) : (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${styles.badge}`}>
          {styles.icon}
          <span>{content}</span>
        </div>
      )}
    </div>
  );
}
