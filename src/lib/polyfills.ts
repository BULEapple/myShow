// 浏览器端 polyfill
// gray-matter 在解析 front-matter 时会调用 Node 的全局 Buffer（utils.toBuffer 使用 Buffer.from）。
// 本项目仅用 gray-matter 解析字符串输入，因此只需提供最小实现即可正常运行。
interface BufferPolyfill {
  from: (input: unknown) => unknown
  isBuffer: (val: unknown) => boolean
}

if (typeof globalThis !== 'undefined') {
  const g = globalThis as unknown as { Buffer?: BufferPolyfill }
  if (!g.Buffer) {
    g.Buffer = {
      from: (input: unknown) => input,
      isBuffer: () => false,
    }
  }
}

export {}
