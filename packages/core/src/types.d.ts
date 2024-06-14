export type AnyObject = Record<string, any>

export interface ContextSchema<Action extends ActionSchema = AnyObject, Component extends ComponentSchema = AnyObject> {
  name: string

  set(name: string, context: ContextSchema<any, any>, skipWarn?: boolean): void
  unset<K extends keyof Component>(name: K): void
  get<K extends keyof Component>(name: K): Component[K]

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

export type ParentComponent = {
  parent: ContextSchema
}

export type SetupCallback<
  Action extends ActionSchema | unknown = unknown,
  Component extends ComponentSchema | unknown = unknown,
> = (ctx: ContextSchema<NonNullable<Action>, NonNullable<Component>>) => void

export interface SealNode<T extends keyof any = string> {
  key: string
  type: T
  props?: Record<string, any>
  meta?: Record<string, any>
  children?: SealNode<T>[]
}

export type SealComponent<T, C = ContextSchema> = T & {
  ctx?: C
}

export type GetContextSchema<T> = T extends SealComponent<AnyObject, infer C> ? C : never
