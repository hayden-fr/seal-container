import {
  ContextSchema,
  SealComponent,
  useSealAction,
} from '@seal-container/vue-render'
import { VNode, defineComponent, ref } from 'vue'

type CountAction = {
  increment: (step?: number) => void
  decrement: (step?: number) => void
}

type CountSchema = ContextSchema<CountAction>

const Count = defineComponent({
  setup(_, { slots }) {
    const count = ref(0)

    const action = useSealAction<CountAction>((action) => {
      action.on('decrement', (step = 1) => {
        count.value -= step
      })

      action.on('increment', (step = 1) => {
        count.value += step
      })
    })

    return () => {
      const children = slots.default?.() ?? []
      const slotDom: Record<string, VNode[]> = {}

      for (const child of children) {
        const slotName = child.props?.value.slot ?? 'default'
        slotDom[slotName] ??= []
        slotDom[slotName].push(child)
      }

      return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {slotDom.decrement ?? (
            <button onClick={() => action.exec('decrement')}>-</button>
          )}
          <span>{count.value}</span>
          {slotDom.increment ?? (
            <button onClick={() => action.exec('increment')}>+</button>
          )}
        </div>
      )
    }
  },
})

export default Count as SealComponent<typeof Count, CountSchema>
