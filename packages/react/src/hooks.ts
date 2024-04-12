import {
  createSealContext,
  type ActionExecuteFn,
  type ActionSchema,
  type AnyObject,
  type ComponentSchema,
  type ContextSchema,
  type SetupCallback,
} from '@seal-container/core-runtime'
import { createContext, useContext, useEffect, useMemo, useRef } from 'react'

const SealContext = createContext(createSealContext())
export const ContextProvider = SealContext.Provider
export const useActionContext = <
  Action extends ActionSchema | unknown = unknown,
>() => {
  return useContext<ContextSchema<NonNullable<Action>>>(SealContext)
}

const MetaContext = createContext<AnyObject>({})
export const MetaProvider = MetaContext.Provider
export const useMetaContext = () => {
  return useContext(MetaContext)
}

export function useSealAction<
  Action extends ActionSchema | unknown = unknown,
  Component extends ComponentSchema | unknown = unknown,
>(
  setup?: SetupCallback<Action, Component>,
): ContextSchema<NonNullable<Action>, NonNullable<Component>> {
  const parentAction = useActionContext()
  const meta = useMetaContext()

  const action = useMemo(() => {
    return createSealContext<any, any>()
  }, [])

  /** 外部监听事件缓存，组件卸载重新加载后，还原外部监听事件 */
  const externalAction = useRef<Record<string, ActionExecuteFn[]>>({})

  useEffect(() => {
    const store = (action as any).action as Map<string, ActionExecuteFn[]>

    setup?.(action)
    for (const key of store.keys()) {
      // 标记内部事件
      const builtin = store.get(key)!.map((fn) => ((fn.builtIn = true), fn))
      store.set(key, builtin)
    }
    for (const key of Object.keys(externalAction.current)) {
      // 加载外部事件
      for (const exec of externalAction.current[key] ?? []) {
        action.on(key, exec)
      }
      // 加载完成后，从外部缓存中删除
      delete externalAction.current[key]
    }
    // 挂载到父级上下文中
    parentAction.set(meta.key, action)

    return () => {
      // 卸载组件时，缓存监听事件，当组件重新加载时自动加载监听事件
      for (const key of store.keys()) {
        const current = store.get(key)!
        externalAction.current[key] = current.filter((fn) => !fn.builtIn)
      }
      // 从父级上下文中卸载，避免重复加载报错
      parentAction.unset(meta.key)
      // 移除所有监听事件
      store.clear()
    }
  }, [])

  return action
}

export function useLatest<T>(val: T) {
  const ref = useRef(val)
  ref.current = val
  return ref
}
