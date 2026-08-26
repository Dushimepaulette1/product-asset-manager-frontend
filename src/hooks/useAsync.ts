import { useCallback, useEffect, useState } from 'react'

type AsyncStatus = 'loading' | 'success' | 'error'

export function useAsync<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [status, setStatus] = useState<AsyncStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const execute = useCallback(() => {
    return fetchFn()
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch((err: Error) => {
        setErrorMessage(err.message)
        setStatus('error')
      })
  }, [fetchFn])

  useEffect(() => {
    execute()
  }, [execute])

  function retry() {
    setStatus('loading')
    execute()
  }

  return { data, setData, status, errorMessage, retry }
}
