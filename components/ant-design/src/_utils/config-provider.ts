import { ConfigProvider, type ConfigProviderProps } from 'antd'
import React from 'react'
import type { MappingAlgorithm, OverrideToken } from './theme'

const { ConfigContext, useConfig } = ConfigProvider

export { ConfigContext, useConfig }

type Prop<T, K extends keyof T> = NonNullable<T[K]>

type ComponentsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[]
  }
}

interface ThemeConfig extends Prop<ConfigProviderProps, 'theme'> {
  /**
   * @descCN 用于修改各个组件的 Component Token 以及覆盖该组件消费的 Alias Token。
   * @descEN Modify Component Token and Alias Token applied to components.
   */
  components?: ComponentsConfig
}

interface ExtendConfigProviderProps extends ConfigProviderProps {
  theme?: ThemeConfig
}

export type { ExtendConfigProviderProps as ConfigProviderProps }

export default ConfigProvider as React.FC<ExtendConfigProviderProps> & {
  /** @private internal Usage. do not use in your production */
  ConfigContext: typeof ConfigContext
  /** @deprecated Please use `ConfigProvider.useConfig().componentSize` instead */
  SizeContext: typeof ConfigProvider.SizeContext
  config: typeof ConfigProvider.config
  useConfig: typeof useConfig
}
