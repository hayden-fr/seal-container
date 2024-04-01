import { useContext, useEffect } from 'react'
import { actionContext } from '../hooks'

export function SealAction() {
  const action = useContext(actionContext)

  useEffect(() => {
    const executed = { current: false }

    const callback = async () => {
      await action.exec('mounted')
      executed.current = true
    }

    const timer = setTimeout(callback, 0)
    return () => {
      clearTimeout(timer)
      if (executed.current) {
        action.exec('unmounted')
      }
    }
  }, [])

  return null
}
