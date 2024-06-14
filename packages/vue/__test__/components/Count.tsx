import { ContextSchema, SealComponent } from '@seal-container/core-runtime'
import { VNode, defineComponent, ref } from 'vue'
import { useSealAction } from '../../src'

type CountAction = {
  increment: (step?: number) => void
  decrement: (step?: number) => void
}

export type CountSchema = ContextSchema<CountAction>

const Count = defineComponent({
  name: 'Count',
  setup(props, { slots }) {
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
      const slotsNodes: Record<string, VNode[]> = {}
      const children = slots.default?.() ?? []
      for (const child of children) {
        const slotName = child.props?.value.slot ?? 'default'
        slotsNodes[slotName] ??= []
        slotsNodes[slotName].push(child)
      }

      return (
        <div>
          {slotsNodes.decrement ?? (
            <button onClick={() => action.exec('decrement')}>-</button>
          )}
          <span>{count.value}</span>
          {slotsNodes.increment ?? (
            <button onClick={() => action.exec('increment')}>+</button>
          )}
        </div>
      )
    }
  },
})

export default Count as SealComponent<typeof Count, CountSchema>
