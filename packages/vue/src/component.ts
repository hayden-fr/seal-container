import {
  ContainerAction,
  createSealContext,
  deepClear,
  migrateSchema,
  type LifeCycleAction,
  type SealNode,
  type SetupCallback,
} from '@seal-container/core-runtime'
import {
  Fragment,
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type Component,
  type PropType,
  type VNode,
} from 'vue'
import { ContextProvider, MetaProvider, useActionContext } from './hooks'

const SealAction = defineComponent({
  name: 'SealAction',
  setup() {
    const action = useActionContext<LifeCycleAction>()

    onMounted(() => {
      action.exec('mounted')
    })

    onUnmounted(() => {
      action.exec('unmounted')
    })

    return () => null
  },
})

type SealNodeFunction = () => SealNode[] | Promise<SealNode[]>

export const SealContainer = defineComponent({
  name: 'SealContainer',
  props: {
    components: {
      type: Object as PropType<Record<string, Component<any>>>,
      default: () => ({}),
    },
    items: {
      type: [Array, Function] as PropType<SealNode[] | SealNodeFunction>,
      default: () => [],
    },
    setup: {
      type: Function as PropType<SetupCallback<any, any>>,
    },
  },
  setup(props) {
    const action = ref<VNode>()
    const rendered = ref<VNode[]>()

    /**
     * The main method for rendering element nodes.
     */
    const renderItems = (items: SealNode[]): VNode[] => {
      return items.map((item) => {
        const { type } = item
        const Component = props.components[type] ?? Fragment
        const children = renderItems(item.children ?? [])
        const component = h(
          Component,
          { ...item.props },
          { default: () => children },
        )
        return h(
          MetaProvider,
          { value: { ...item.meta, key: item.key } },
          { default: () => component },
        )
      })
    }

    const preload = ref(false)
    const preloadContext = createSealContext({
      automatic: true,
      name: 'preload-global',
    })
    const originalContext = createSealContext<
      LifeCycleAction & ContainerAction
    >({ name: 'global' })

    /** Global context */
    const context = new Proxy(originalContext, {
      get(target, p, receiver) {
        if (preload.value) {
          return Reflect.get(preloadContext, p, receiver)
        }
        return Reflect.get(target, p, receiver)
      },
    })

    onMounted(() => {
      preload.value = true
      props.setup?.(context)

      const templateReady = async (template: SealNode[]) => {
        const modified = await context.exec('template_ready', template ?? [])
        const elements = renderItems(modified ?? template ?? [])
        rendered.value = elements
        preload.value = false
      }

      const fetchTemplate = async () => {
        return new Promise<SealNode[]>((resolve) => {
          const itemsPromise =
            typeof props.items === 'function'
              ? props.items()
              : Promise.resolve(props.items)

          Promise.resolve(itemsPromise).then(resolve)
        })
      }

      fetchTemplate().then(templateReady)
    })

    const migrated = ref(false)
    watch(
      () => rendered,
      () => {
        nextTick(() => {
          migrateSchema(context, preloadContext)
          deepClear(preloadContext)
          migrated.value = true
          action.value = h(SealAction)
        })
      },
      { deep: true },
    )

    return () =>
      h(
        ContextProvider,
        { value: context },
        { default: () => [action.value, rendered.value] },
      )
  },
})
