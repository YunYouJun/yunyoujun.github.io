export function getAiDisclosure(value: unknown): string | null {
  if (!value || typeof value !== 'object')
    return null
  const ai = value as { mode?: unknown, reviewed?: unknown }
  const label = ai.mode === 'assisted' ? 'AI 辅助创作' : ai.mode === 'generated' ? 'AI 生成' : null
  if (!label)
    return null
  return ai.reviewed === true ? `${label} · 作者已审阅` : label
}
