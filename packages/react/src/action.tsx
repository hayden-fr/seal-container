import { EventSchema } from '@sealjs/core-runtime'
import { useContext, useEffect } from 'react'
import { actionContext } from './context'
import type { LifeCycleAction } from './types'

export function SealAction() {
  const action = useContext<EventSchema<LifeCycleAction>>(actionContext)

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
