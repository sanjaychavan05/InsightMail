import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-900">Analyzing email…</p>
        <p className="text-gray-500">This may take 3–5 seconds</p>
      </div>
    </div>
  );
}
