'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface LogEntry {
  type: 'log' | 'error' | 'warn' | 'info' | 'result';
  args: string[];
  id: number;
}

const STARTER_CODE = `// JavaScript Console — runs sandboxed in an iframe
// Try some examples:

const greeting = (name) => \`Hello, \${name}!\`;
console.log(greeting('World'));

// Math
console.log(Math.PI.toFixed(5));

// Array operations
const nums = [1, 2, 3, 4, 5];
console.log('Sum:', nums.reduce((a, b) => a + b, 0));

// Fetch (sandbox allows network)
// fetch('https://api.github.com/users/octocat')
//   .then(r => r.json())
//   .then(d => console.log(d.name));
`;

let idCounter = 0;

export function JsConsoleWindow() {
  const [code, setCode] = useState(STARTER_CODE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.source !== 'birdos-console') return;
      const { type, args } = e.data as { source: string; type: string; args: string[] };
      setLogs((prev) => [...prev, { type: type as LogEntry['type'], args, id: idCounter++ }]);
      if (type === 'done' || type === 'error') setIsRunning(false);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setLogs([]);

    const sandboxSrc = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
const _post = (type, args) => window.parent.postMessage({ source: 'birdos-console', type, args }, '*');
const _fmt = (...a) => a.map(x => {
  try { return typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x); } catch { return String(x); }
});
console.log = (...a) => _post('log', _fmt(...a));
console.error = (...a) => _post('error', _fmt(...a));
console.warn = (...a) => _post('warn', _fmt(...a));
console.info = (...a) => _post('info', _fmt(...a));
window.onerror = (msg, src, line) => { _post('error', [msg + ' (line ' + line + ')']); return true; };
window.onunhandledrejection = (e) => _post('error', ['Unhandled promise rejection: ' + e.reason]);
(async () => {
  try {
    const __result = await eval(${JSON.stringify(`(async () => { ${code} })()`)} );
    _post('done', []);
  } catch(e) {
    _post('error', [e.message]);
    _post('done', []);
  }
})();
</script>
</body>
</html>`;

    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = sandboxSrc;
  }, [code]);

  const clearConsole = useCallback(() => setLogs([]), []);

  const logColor: Record<LogEntry['type'], string> = {
    log: 'text-zinc-100',
    info: 'text-blue-300',
    warn: 'text-yellow-300',
    error: 'text-red-400',
    result: 'text-green-300'
  };

  return (
    <div className='flex h-full flex-col bg-zinc-950 font-mono text-sm text-zinc-100'>
      {/* Toolbar */}
      <div className='flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-3 py-2'>
        <div className='flex items-center gap-1.5'>
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='text-yellow-400'
          >
            <path d='M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z' />
          </svg>
          <span className='text-xs font-semibold text-zinc-300'>JavaScript Console</span>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={clearConsole}
            className='text-xs text-zinc-400 hover:text-zinc-100'
          >
            Clear
          </Button>
          <Button
            size='sm'
            onClick={runCode}
            disabled={isRunning}
            className='flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-xs font-semibold text-white'
          >
            <svg width='10' height='10' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M8 5v14l11-7z' />
            </svg>
            {isRunning ? 'Running…' : 'Run'}
          </Button>
        </div>
      </div>

      {/* Editor + Output split */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Monaco Editor */}
        <div className='flex-1 overflow-hidden border-b border-zinc-800' style={{ minHeight: 0 }}>
          <MonacoEditor
            height='100%'
            language='javascript'
            theme='vs-dark'
            value={code}
            onChange={(v) => setCode(v ?? '')}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 8, bottom: 8 }
            }}
          />
        </div>

        {/* Console output */}
        <div className='flex h-40 shrink-0 flex-col overflow-hidden'>
          <div className='flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-1'>
            <span className='text-[10px] uppercase tracking-widest text-zinc-500'>Output</span>
            <span className='text-[10px] text-zinc-600'>
              {logs.length} line{logs.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className='flex-1 overflow-auto px-3 py-2'>
            {logs.length === 0 && (
              <p className='text-[11px] text-zinc-600'>Press Run to execute code…</p>
            )}
            {logs.map((entry) => (
              <div
                key={entry.id}
                className={`flex gap-2 text-[12px] leading-relaxed ${logColor[entry.type]}`}
              >
                <span className='shrink-0 select-none text-zinc-400'>{'>'}</span>
                <pre className='whitespace-pre-wrap break-words font-mono'>
                  {entry.args.join(' ')}
                </pre>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Hidden sandbox iframe */}
      <iframe ref={iframeRef} title='JS Sandbox' className='hidden' sandbox='allow-scripts' />
    </div>
  );
}
