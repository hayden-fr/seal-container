import { SealContainer, SealNode } from '@seal-container/vue-render'
import { defineComponent } from 'vue'
import * as components from './components'

export default defineComponent({
  setup() {
    const items: SealNode<keyof typeof components>[] = [
      {
        key: 'code',
        type: 'Count',
        children: [
          {
            key: 'inc',
            type: 'Button',
            meta: {
              slot: 'increment',
            },
          },
          {
            key: 'dec',
            type: 'Button',
            meta: {
              slot: 'decrement',
            },
          },
        ],
      },
    ]

    return () => {
      return (
        <SealContainer components={components} items={items}></SealContainer>
      )
    }
  },
})
