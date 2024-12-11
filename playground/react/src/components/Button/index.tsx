import {
  ContextSchema,
  SealFunctionComponent,
  useSealAction,
} from '@seal-container/react-render'

type ButtonAction = {
  click: () => void
}

type ButtonSchema = ContextSchema<ButtonAction>

interface ButtonProps {
  content?: string
}

const Button: SealFunctionComponent<ButtonProps, ButtonSchema> = (props) => {
  const action = useSealAction<ButtonAction>()

  return (
    <button
      onClick={() => {
        action.exec('click')
      }}
    >
      {props.content}
    </button>
  )
}

export default Button
