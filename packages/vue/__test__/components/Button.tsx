import { ContextSchema, SealComponent } from '@seal-container/core-runtime'
import { defineComponent } from 'vue'
import { useSealAction } from '../../src'

type ButtonAction = {
  click: () => void
}

export type ButtonSchema = ContextSchema<ButtonAction>

const Button = defineComponent({
  name: 'Button',
  props: {
    label: {
      type: String,
    },
  },
  setup(props) {
    const action = useSealAction<ButtonAction>()
    return () => {
      return <button onClick={() => action.exec('click')}>{props.label}</button>
    }
  },
})

export default Button as SealComponent<typeof Button, ButtonSchema>
