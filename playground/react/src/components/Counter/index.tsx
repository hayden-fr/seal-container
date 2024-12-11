import {
  ContextSchema,
  SealFunctionComponent,
  useSealAction,
} from '@seal-container/react-render'
import { useState } from 'react'
import './index.css'

type CounterAction = {
  increment: () => void
  decrement: () => void
}

type CounterSchema = ContextSchema<CounterAction>

const Counter: SealFunctionComponent<unknown, CounterSchema> = () => {
  const [counter, setCounter] = useState(0)

  const action = useSealAction<CounterAction>((ctx) => {
    ctx.on('increment', () => {
      setCounter((prev) => prev + 1)
    })

    ctx.on('decrement', () => {
      setCounter((prev) => prev - 1)
    })
  })

  return (
    <div className="counter">
      <button onClick={() => action.exec('decrement')}>-</button>
      <span className="counter-content">{counter}</span>
      <button onClick={() => action.exec('increment')}>+</button>
    </div>
  )
}

export default Counter
