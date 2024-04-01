<template>
  <seal-action v-if="migrated"></seal-action>
  <seal-node-container></seal-node-container>
</template>

<script setup lang="ts" name="SealContainer">
import {
  ContainerAction,
  createSealContext,
  deepClear,
  LifeCycleAction,
  migrateSchema,
  SealNode,
  SetupSchema,
} from '@sealjs/core-runtime'
import SealAction from './action.vue'
import {
  h,
  Component,
  computed,
  onMounted,
  ref,
  Fragment,
  defineComponent,
  VNode,
  provide,
  watch,
  nextTick,
} from 'vue'
import { sealActionProvider, sealMetaProvider } from '../hooks'

const MetaProvider = defineComponent({
  name: 'MetaProvider',
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  provide() {
    return {
      [sealMetaProvider]: this.value,
    }
  },
  render() {
    return this.$slots.default?.() ?? null
  },
})

interface Props {
  components: Record<string, Component<any>>
  items: SealNode[] | (() => SealNode[] | Promise<SealNode[]>)
  setup?: SetupSchema<any, any>
}

const props = defineProps<Props>()

const preload = ref(false)
const preloadContext = createSealContext({ automatic: true })
const originalContext = createSealContext()
const context = new Proxy(originalContext, {
  get(target, p, receiver) {
    if (preload.value) {
      return Reflect.get(preloadContext, p, receiver)
    }
    return Reflect.get(target, p, receiver)
  },
})

provide(sealActionProvider, context)

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

const rendered = ref<VNode[]>()
const SealNodeContainer = () => {
  return rendered.value
}

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
      console.log('开始迁移')
      migrateSchema(context, preloadContext)
      deepClear(preloadContext)
      migrated.value = true
    })
  },
  { deep: true },
)
</script>
