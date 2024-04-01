export interface ContextSchema<
  Action extends ActionSchema = Record<string, any>,
  Component extends ComponentSchema = Record<string, any>,
> {
  set(name: string, context: ContextSchema<any, any>, skipWarn?: boolean): void
  unset<K extends keyof Component>(name: K): void
  get<K extends keyof Component>(name: K): Component[K]
  get<T extends ContextSchema>(name: string): T

  on<K extends keyof Action>(name: K, exec: Async<Action[K]>): void
  rm<K extends keyof Action>(name: K, exec: Async<Action[K]>): void
  exec<K extends keyof Action>(name: K, ...args: Parameters<Action[K]>): Promise<ReturnType<Action[K]> | undefined>
}

export type Async<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T> | Promise<ReturnType<T>>

export interface ActionExecuteFn {
  (...args: any[]): any
  builtIn?: boolean
}

export interface ActionSchema {
  [k: string]: ActionExecuteFn
}

export interface ComponentSchema {
  [k: string]: ContextSchema<any, any>
}

export type LifeCycleAction = {
  mounted: () => void
  unmounted: () => void
}

export type ContainerAction = {
  template_ready: (template: SealNode[]) => SealNode[] | undefined | void
}

export type NonAsyncVoidFunction = (...args: any[]) => void

export type SetupSchema<
  Action extends ActionSchema | unknown = unknown,
  Component extends ComponentSchema = Record<string, never>,
> = NonAsyncVoidFunction & ((ctx: ContextSchema<Action & LifeCycleAction, Component>) => void)

export interface SealNode<T extends keyof any = string> {
  key: string
  type: T
  props?: Record<string, any>
  meta?: Record<string, any>
  children?: SealNode[]
}
