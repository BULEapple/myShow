// Markdown 编辑器：支持「编辑 / 分屏 / 预览」三种模式
import { useState } from 'react'
import { Markdown } from '@/components/ui/Markdown'

type Mode = 'edit' | 'split' | 'preview'

const MODES: { key: Mode; label: string }[] = [
  { key: 'edit', label: '编辑' },
  { key: 'split', label: '分屏' },
  { key: 'preview', label: '预览' },
]

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
}

export function MarkdownEditor({
  value,
  onChange,
  label = '内容',
  error,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>('split')

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
          <span className="ml-0.5 text-red-400">*</span>
        </label>
        <div className="flex rounded-chip border border-white/10 bg-white/5 p-0.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`rounded-[10px] px-3 py-1 text-xs transition-colors ${
                mode === m.key
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid gap-3 ${
          mode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {mode !== 'preview' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={16}
            spellCheck={false}
            className="w-full resize-y rounded-card border border-white/10 bg-white/5 p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="支持 Markdown 语法…"
          />
        )}
        {mode !== 'edit' && (
          <div className="max-h-[28rem] overflow-y-auto rounded-card border border-white/10 bg-white/5 p-4">
            <Markdown content={value || '_暂无内容_'} />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
