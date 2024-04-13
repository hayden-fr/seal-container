import { t } from './i18n'
import type {
  ActionSchema,
  Async,
  ComponentSchema,
  ContextSchema,
} from './types'

export interface ContextConfig {
  name?: string
  automatic?: boolean
}

export class Context<
  Action extends ActionSchema = Record<string, any>,
  Component extends ComponentSchema = Record<string, any>,
> implements ContextSchema<Action, Component>
{
  name: string

  protected action: Map<keyof Action, Async<Action[keyof Action]>[]>

  protected component: Map<keyof Component, Component[keyof Component]>

  protected config: ContextConfig

  constructor(config?: ContextConfig) {
    this.action = new Map()
    this.component = new Map()
    this.config = config ?? {}
    this.name = config?.name ?? Math.random().toString(36).slice(2)
  }

  set(
    name: string,
    context: ContextSchema<any, any>,
    skipWarn?: boolean,
  ): void {
    if (this.component.has(name) && !skipWarn) {
      const message = t('hasBeenRegistered', [name])
      const error = new Error(message)
      console.warn(error)
    }
    this.component.set(name, context as Component[keyof Component])
  }

  unset<K extends keyof Component>(name: K): void {
    this.component.delete(name)
  }

  get<K extends keyof Component>(name: K): Component[K]
  get<T extends ContextSchema>(name: string): T
  get(name: keyof Component | string) {
    const schema = this.component.get(name)
    if (schema) return schema

    const component = new Context() as any
    if (this.config.automatic) {
      this.component.set(name, component)
      return component
    }

    const message = t('notBeenRegistered', [name.toString()])
    const error = new Error(message)
    console.warn(error)
    return component
  }

  on<K extends keyof Action>(name: K, exec: Async<Action[K]>): void {
    const queue = this.action.get(name) ?? []
    queue.push(exec)
    this.action.set(name, queue)
  }

  rm<K extends keyof Action>(name: K, exec: Async<Action[K]>): void {
    const queue = this.action.get(name) ?? []
    queue.splice(queue.indexOf(exec), 1)
    this.action.set(name, queue)
  }

  async exec<K extends keyof Action>(
    name: K,
    ...args: Parameters<Action[K]>
  ): Promise<ReturnType<Action[K]> | undefined> {
    const queue = this.action.get(name) ?? []
    let result: ReturnType<Action[K]> | undefined
    for (const exec of queue) {
      result = await exec(...args)
    }
    return result
  }
}
