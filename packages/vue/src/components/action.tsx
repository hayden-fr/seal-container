import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useActionContext } from '../hooks'

export const SealAction = defineComponent({
  name: 'SealAction',
  setup() {
    const action = useActionContext()

    onMounted(() => {
      action.exec('mounted')
    })

    onUnmounted(() => {
      action.exec('unmounted')
    })

    return () => null
  },
})
