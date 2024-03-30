import type {
  ActionSchema,
  ComponentSchema,
  EventSchema,
} from '@sealjs/core-runtime'

export interface SealNode<T extends keyof any = string> {
  key: string
  type: T
  props?: Record<string, any>
  meta?: Record<string, any>
  children?: SealNode[]
}

export type LifeCycleAction = {
  mounted: () => void
  unmounted: () => void
}

export type ContainerAction = {
  template_ready: (template: SealNode[]) => SealNode[] | undefined | void
}

export type Context<
  Action extends ActionSchema | unknown = unknown,
  Component extends ComponentSchema = Record<string, never>,
> = EventSchema<Action & LifeCycleAction, Component>

export type ActionSetup<
  Action extends ActionSchema | unknown = unknown,
  Component extends ComponentSchema = Record<string, never>,
> = (ctx: Context<Action, Component>) => void
