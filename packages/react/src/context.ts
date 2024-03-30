import {
  ActionSchema,
  ComponentSchema,
  EventSchema,
} from '@sealjs/core-runtime'
import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import type { ActionSetup, LifeCycleAction } from './types'

export const actionContext = createContext(new EventSchema<any, any>())

export const SchemaContext = actionContext.Provider

export const metaContext = createContext<Record<string, any>>({})

export const MetaContext = metaContext.Provider

export function useSealAction<
  Action extends ActionSchema = Record<string, any>,
  Component extends ComponentSchema = Record<string, any>,
>(setup?: ActionSetup<Action, Component>) {
  const parentAction = useContext(actionContext)

  const meta = useContext(metaContext)

  const action = useMemo(() => {
    return new EventSchema<Action & LifeCycleAction, Component>()
  }, [])

  // 外部监听事件缓存，组件卸载重新加载后，还原外部监听事件
  const externalAction = useRef<Record<string, any[]>>({} as any)

  useEffect(() => {
    const store = (action as any).action as Map<string, any[]>

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
