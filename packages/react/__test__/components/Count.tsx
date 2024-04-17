import { ContextSchema, SealComponent } from '@seal-container/core-runtime'
import {
  Children,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  isValidElement,
  useMemo,
  useState,
} from 'react'
import { useSealAction } from '../../src'

type CountAction = {
  increment: (step?: number) => void
  decrement: (step?: number) => void
}

export type CountSchema = ContextSchema<CountAction>

interface CountProps {}

const Count: FunctionComponent<PropsWithChildren<CountProps>> = (props) => {
  const [count, setCount] = useState(0)

  const slotsNodes = useMemo(() => {
    const slotsNodes: Record<string, ReactElement[]> = {}
    const children = Children.toArray(props.children)
    for (const child of children) {
      if (isValidElement(child)) {
        const slotName = child.props.value.slot ?? 'default'
        slotsNodes[slotName] ??= []
        slotsNodes[slotName].push(child)
      }
    }
    return slotsNodes
  }, [])

  const action = useSealAction<CountAction>((action) => {
    action.on('decrement', (step = 1) => {
      setCount((count) => count - step)
    })

    action.on('increment', (step = 1) => {
      setCount((count) => count + step)
    })
  })

  return (
    <div>
      {slotsNodes.decrement ?? (
        <button onClick={() => action.exec('decrement')}>-</button>
      )}
      <span>{count}</span>
      {slotsNodes.increment ?? (
        <button onClick={() => action.exec('increment')}>+</button>
      )}
    </div>
  )
}

export default Count as SealComponent<typeof Count, CountSchema>
