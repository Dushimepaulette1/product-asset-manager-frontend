export function resolveAfterDelay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export function rejectAfterDelay(message: string, ms = 400): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms)
  })
}
