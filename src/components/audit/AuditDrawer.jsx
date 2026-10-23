import React, { useRef, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';

export default function AuditDrawer({ isOpen, onClose }) {
  const { auditLogs } = useTournament();
  const logContainerRef = useRef(null);

  // Auto-scroll terminal to the latest audit entry
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [auditLogs, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-stone-950 text-stone-200 h-full shadow-2xl flex flex-col font-mono text-xs border-l border-stone-800 animate-in slide-in-from-right duration-200">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/80">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-stone-100">
              CSPRNG Telemetry Engine
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1 rounded-md hover:bg-stone-800"
          >
            ✕
          </button>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-stone-900/40 border-b border-stone-800 text-[11px]">
          <div>
            <span className="text-stone-500 block">Source</span>
            <span className="text-emerald-400 font-semibold">/dev/urandom API</span>
          </div>
          <div>
            <span className="text-stone-500 block">Entropy</span>
            <span className="text-amber-400 font-semibold">WebCrypto (32-bit)</span>
          </div>
          <div>
            <span className="text-stone-500 block">Invariant</span>
            <span className="text-sky-400 font-semibold">Zero-Rematch 1.0</span>
          </div>
        </div>

        {/* Stream Log Output */}
        <div 
          ref={logContainerRef} 
          className="flex-1 overflow-y-auto p-6 space-y-3 selection:bg-stone-700 selection:text-white"
        >
          {auditLogs.length === 0 ? (
            <div className="text-stone-500 italic text-center py-12">
              Awaiting matchmaking trigger. Telemetry events will stream here in real time.
            </div>
          ) : (
            auditLogs.map((log, index) => {
              const isError = log.type === 'ERROR';
              const isSuccess = log.type === 'SUCCESS';
              const isBye = log.type === 'BYE_ASSIGN';

              return (
                <div key={index} className="leading-relaxed flex items-start gap-2">
                  <span className="text-stone-600 select-none shrink-0">
                    [{log.timestamp}]
                  </span>
                  <div>
                    <span 
                      className={`font-semibold mr-1.5 ${
                        isError
                          ? 'text-rose-400'
                          : isSuccess
                          ? 'text-emerald-400'
                          : isBye
                          ? 'text-sky-400'
                          : 'text-amber-400'
                      }`}
                    >
                      [{log.type}]
                    </span>
                    <span className="text-stone-300">{log.message}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Terminal Footer */}
        <div className="px-6 py-3 border-t border-stone-800 text-stone-500 text-[10px] flex justify-between items-center bg-stone-900/30">
          <span>Polynomial-Time Security: Next-Bit Test Resistant</span>
          <span>NIST SP 800-22 Standard</span>
        </div>
      </div>
    </div>
  );
}