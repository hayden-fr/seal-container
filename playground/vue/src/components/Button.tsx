// import { ContextSchema, SealComponent } from '@seal-container/core-runtime'
import {
  ContextSchema,
  SealComponent,
  useSealAction,
} from '@seal-container/vue-render'
import { defineComponent } from 'vue'
// import { useSealAction } from '../../src'

type ButtonAction = {
  click: () => void
}

type ButtonSchema = ContextSchema<ButtonAction>

const Button = defineComponent({
  setup() {
    const action = useSealAction<ButtonAction>()
    return () => {
      return <button onClick={() => action.exec('click')}></button>
    }
  },
})

export default Button as SealComponent<typeof Button, ButtonSchema>
