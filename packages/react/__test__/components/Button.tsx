import { ContextSchema, SealComponent } from '@seal-container/core-runtime'
import { FunctionComponent } from 'react'
import { useSealAction } from '../../src'

type ButtonACtion = {
  click: () => void
}

export type ButtonSchema = ContextSchema<ButtonACtion>

interface ButtonProps {
  label: string
}

const Button: FunctionComponent<ButtonProps> = (props) => {
  const action = useSealAction<ButtonACtion>()

  return <button onClick={() => action.exec('click')}>{props.label}</button>
}

export default Button as SealComponent<typeof Button, ButtonSchema>
