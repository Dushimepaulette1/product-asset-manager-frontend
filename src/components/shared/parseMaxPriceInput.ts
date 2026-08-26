export function parseMaxPriceInput(raw: string): number | undefined | null {
  if (raw === '') return undefined

  const parsed = Number(raw)
  if (Number.isNaN(parsed) || parsed < 0) return null

  return parsed
}
