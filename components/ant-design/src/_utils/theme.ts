import type { CSSInterpolation } from '@ant-design/cssinjs'
import type {
  AliasToken,
  ComponentTokenMap as BaseComponentTokenMap,
  GenerateStyle,
  MappingAlgorithm,
} from 'antd/es/theme/interface'
import { genStyleHooks as genStyleHooksFn } from 'antd/es/theme/internal'
import type {
  CSSUtil,
  StyleInfo,
} from 'antd/es/theme/util/genComponentStyleHook'
import type { ComponentToken as HeaderComponentToken } from '../header/style'
import type { ComponentToken as QueryBuilderComponentToken } from '../query-builder/style'
import type { ComponentToken as SplitterComponentToken } from '../splitter/style'

export type { GenerateStyle, MappingAlgorithm }

export interface ComponentTokenMap extends BaseComponentTokenMap {
  Header?: HeaderComponentToken
  QueryBuilder?: QueryBuilderComponentToken
  Splitter?: SplitterComponentToken
}

export type OverrideComponent = keyof ComponentTokenMap

export type OverrideToken = {
  [key in keyof ComponentTokenMap]: Partial<ComponentTokenMap[key]> &
    Partial<AliasToken>
}

export type GlobalToken = AliasToken & ComponentTokenMap

export type GlobalTokenWithComponent<C extends OverrideComponent> =
  GlobalToken & ComponentTokenMap[C]

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string
  /** Wrap icon class with `.` prefix */
  iconCls: string
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string
} & CSSUtil

export type FullToken<C extends OverrideComponent> = TokenWithCommonCls<
  GlobalTokenWithComponent<C>
>

export type GenStyleFn<C extends OverrideComponent> = (
  token: FullToken<C>,
  info: StyleInfo,
) => CSSInterpolation

export type GetDefaultToken<C extends OverrideComponent> =
  | null
  | ComponentTokenMap[C]
  | ((
      token: AliasToken & Partial<ComponentTokenMap[C]>,
    ) => ComponentTokenMap[C])

export type GenStyleHooksFn = <C extends keyof ComponentTokenMap>(
  component: C | [C, string],
  styleFn: GenStyleFn<C>,
  getDefaultToken?: GetDefaultToken<C>,
  options?: {
    resetStyle?: boolean | undefined
    deprecatedTokens?:
      | [
          keyof Exclude<OverrideToken[C], undefined>,
          keyof Exclude<OverrideToken[C], undefined>,
        ][]
      | undefined
    /**
     * Component tokens that do not need unit.
     */
    unitless?:
      | (keyof Exclude<OverrideToken[C], undefined> extends infer T extends
          keyof Exclude<OverrideToken[C], undefined>
          ? { [key in T]: boolean }
          : never)
      | undefined
    /**
     * Only use component style in client side. Ignore in SSR.
     */
    clientOnly?: boolean | undefined
    /**
     * Set order of component style.
     * @default -999
     */
    order?: number | undefined
    /**
     * Whether generate styles
     * @default true
     */
    injectStyle?: boolean | undefined
  },
) => ReturnType<typeof genStyleHooksFn>

export const genStyleHooks = genStyleHooksFn as GenStyleHooksFn
