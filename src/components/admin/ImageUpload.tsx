// 图片上传：选择本地图片转为 base64 data URL 存储（适配 localStorage 数据层）
import { useRef, useState } from 'react'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  alt?: string
}

export function ImageUpload({ value, onChange, alt = '图片' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('图片不能超过 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.onerror = () => setError('读取图片失败')
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="flex items-start gap-4">
        {/* 预览 */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-chip border border-white/10 bg-white/5">
          {value ? (
            <img src={value} alt={alt} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">暂无图片</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0])
              // 重置，保证选择同一文件时也能再次触发
              e.target.value = ''
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-chip border border-white/15 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              上传图片
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center justify-center rounded-chip px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-red-400"
              >
                移除
              </button>
            )}
          </div>
          <p className="text-xs text-muted">
            支持 jpg / png / svg / webp 等，不超过 2MB
          </p>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
