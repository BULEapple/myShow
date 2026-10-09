// SEO 工具：动态设置页面 title 与 meta description
import { useEffect } from 'react'

const SITE_NAME = '个人作品集'

/** 设置当前页面的 title 与 description */
export function useSEO(title?: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      )
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])
}
