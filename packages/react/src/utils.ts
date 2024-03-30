import {
  EventSchema,
  type ActionSchema,
  type ComponentSchema,
} from '@sealjs/core-runtime'
import type { ActionSetup, ContainerAction } from './types'

export function defineSealSetup<
  Action extends ActionSchema | unknown,
  Component extends ComponentSchema,
>(setup: ActionSetup<Action & ContainerAction, Component>) {
  return setup
}
export function createSealContext<
  Action extends ActionSchema = Record<string, any>,
  Component extends ComponentSchema = Record<string, any>,
>() {
  return new EventSchema<Action, Component>()
}

export function migrateSchema(target: EventSchema, source: EventSchema) {
  const targetStore = (target as any).action as Map<string, any[]>
  const sourceStore = (source as any).action as Map<string, any[]>

  for (const key of sourceStore.keys()) {
    const targetQueue = targetStore.get(key) ?? []
    const sourceQueue = sourceStore.get(key) ?? []
    for (const fn of sourceQueue) {
      targetQueue.push(fn)
    }
    targetStore.set(key, targetQueue)
  }

  const targetSchemas = (target as any).component as Map<string, EventSchema>
  const sourceSchemas = (source as any).component as Map<string, EventSchema>

  for (const key of sourceSchemas.keys()) {
    const targetSchema = targetSchemas.get(key)
    const sourceSchema = sourceSchemas.get(key)
    if (targetSchema && sourceSchema) {
      migrateSchema(targetSchema, sourceSchema)
    }
  }
}

export function deepClear(schema: EventSchema) {
  type ActionStore = Map<string, any[]>
  type ComponentStore = Map<string, EventSchema>

  // 清除非内置的监听事件
  const store = (schema as any).action as ActionStore
  for (const key of store.keys()) {
    const queue = store.get(key) ?? []
    const newQueue = queue.filter((fn) => fn.builtIn)
    if (newQueue.length === 0) {
      store.delete(key)
    } else {
      store.set(key, newQueue)
    }
  }

  // 深度清理所有子组件
  const component = (schema as any).component as ComponentStore
  for (const key of component.keys()) {
    deepClear(component.get(key)!)
  }
}
