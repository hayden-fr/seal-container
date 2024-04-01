import {
  ActionExecuteFn,
  ActionSchema,
  ComponentSchema,
  ContextSchema,
  LifeCycleAction,
  SetupSchema,
  createSealContext,
} from '@sealjs/core-runtime'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'

export const sealActionProvider = 'sealActionProvider'

export const sealMetaProvider = 'sealMetaProvider'

export function useSealAction<
  Action extends ActionSchema = Record<string, any>,
  Component extends ComponentSchema = Record<string, any>,
>(setup?: SetupSchema<Action, Component>) {
  const parentAction = inject<ContextSchema>(sealActionProvider)
  const meta = inject<Record<string, any>>(sealMetaProvider, {})

  const action = createSealContext<Action & LifeCycleAction, Component>()

  // 外部监听事件缓存，组件卸载重新加载后，还原外部监听事件
  const externalAction = ref<Record<string, any[]>>({})

  const store = (action as any).action as Map<string, ActionExecuteFn[]>

  onMounted(() => {
    setup?.(action)
    for (const key of store.keys()) {
      // 标记内部事件
      const builtin = store.get(key)!.map((fn) => ((fn.builtIn = true), fn))
      store.set(key, builtin)
    }
    for (const key of Object.keys(externalAction.value)) {
      // 加载外部事件
      for (const exec of externalAction.value[key] ?? []) {
        action.on(key, exec)
      }
      // 加载完成后，从外部缓存中删除
      delete externalAction.value[key]
    }
    // 挂载到父级上下文中
    parentAction?.set(meta.key, action)
  })

  onBeforeUnmount(() => {
    // 卸载组件时，缓存监听事件，当组件重新加载时自动加载监听事件
    for (const key of store.keys()) {
      const current = store.get(key)!
      externalAction.value[key] = current.filter((fn) => !fn.builtIn)
    }
    // 从父级上下文中卸载，避免重复加载报错
    parentAction?.unset(meta.key)
    // 移除所有监听事件
    store.clear()
  })

  return action
}
