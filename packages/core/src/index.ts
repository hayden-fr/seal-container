import { t } from './i18n'

type Async<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T> | Promise<ReturnType<T>>

export interface ActionSchema {
  [k: string]: (...args: any[]) => any
}

export interface ComponentSchema {
  [k: string]: EventSchema<any, any>
}

export class EventSchema<
  Action extends ActionSchema = Record<string, any>,
  Component extends ComponentSchema = Record<string, any>,
> {
  protected action: Map<keyof Action, Async<Action[keyof Action]>[]>

  protected component: Map<keyof Component, Component[keyof Component]>

  constructor() {
    this.action = new Map()
    this.component = new Map()
  }

  set(name: string, context: EventSchema<any, any>, skipWarn = false) {
    if (this.component.has(name) && !skipWarn) {
      const message = t('hasBeenRegistered', [name])
      const error = new Error(message)
      console.warn(error)
    }
    this.component.set(name, context as Component[keyof Component])
  }

  get<K extends keyof Component>(name: K): Component[K]
  get<T extends EventSchema>(name: string): T
  get<K extends keyof Component>(name: K): Component[K] {
    const schema = this.component.get(name)
    if (schema) return schema as Component[K]
    const component = new EventSchema() as Component[K]
    const message = t('notBeenRegistered', [name.toString()])
    const error = new Error(message)
    console.warn(error)
    return component
  }

  unset<K extends keyof Component>(name: K) {
    this.component.delete(name)
  }

  on<K extends keyof Action>(name: K, exec: Async<Action[K]>) {
    const queue = this.action.get(name) ?? []
    queue.push(exec)
    this.action.set(name, queue)
  }

  async exec<K extends keyof Action>(name: K, ...args: Parameters<Action[K]>) {
    const queue = this.action.get(name) ?? []
    let result: ReturnType<Action[K]> | undefined
    for (const exec of queue) {
      result = await exec(...args)
    }
    return result
  }

  rm<K extends keyof Action>(name: K, fn: Action[K]) {
    const queue = this.action.get(name) ?? []
    queue.splice(queue.indexOf(fn), 1)
    this.action.set(name, queue)
  }
}
