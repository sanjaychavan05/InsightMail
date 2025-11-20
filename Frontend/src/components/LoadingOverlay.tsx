import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="glass-effect-strong rounded-3xl p-10 shadow-2xl flex flex-col items-center gap-4 border border-white/20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />
          <Loader2 className="w-16 h-16 text-white animate-spin relative z-10" />
        </div>
        <p className="text-white font-semibold text-lg">Analyzing email…</p>
        <p className="text-white/60">AI is processing your request</p>
        <div className="flex gap-1 mt-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
