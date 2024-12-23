import {
  createSealContext,
  deepClear,
  migrateSchema,
  type AnyObject,
  type ContainerAction,
  type ContextSchema,
  type LifeCycleAction,
  type SealNode,
  type SetupCallback,
} from '@seal-container/core-runtime'
import {
  Fragment,
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type FunctionComponent,
  type ReactNode,
} from 'react'
import {
  ContextProvider,
  MetaProvider,
  useActionContext,
  useLatest,
} from './hooks'

const SealAction: FunctionComponent = () => {
  const action = useActionContext<LifeCycleAction>()

  useEffect(() => {
    const executed = { current: false }

    const callback = async () => {
      await action.exec('mounted')
      executed.current = true
    }

    const timer = setTimeout(callback, 0)
    return () => {
      clearTimeout(timer)
      if (executed.current) {
        action.exec('unmounted')
      }
    }
  }, [])

  return null
}

type SealNodeFunction<ComponentCollection> = () =>
  | SealNode<keyof ComponentCollection>[]
  | Promise<SealNode<keyof ComponentCollection>[]>

export interface SealContainerProps<
  ComponentCollection extends Record<string, ComponentType<any>> = AnyObject,
> {
  components?: ComponentCollection
  items?:
    | SealNode<keyof ComponentCollection>[]
    | SealNodeFunction<ComponentCollection>
  setup?: SetupCallback<any, any>
}

export const SealContainer: FunctionComponent<SealContainerProps> = (
  props: SealContainerProps,
) => {
  const [action, setAction] = useState<ReactNode>(null)
  const [rendered, setRendered] = useState<ReactNode>(null)
  const ready = useLatest(Boolean(rendered))

  /**
   * The main method for rendering element nodes.
   */
  const renderItems = (items: SealNode[]): ReactNode[] => {
    return items.map((item) => {
      const { type } = item
      const Component = props.components?.[type] ?? Fragment
      const children = renderItems(item.children ?? [])
      return createElement(
        MetaProvider,
        { key: item.key, value: { ...item.meta, key: item.key } },
        createElement(Component, { ...item.props }, children),
      )
    })
  }

  const preload = useRef(false)
  const preloadContext = useMemo(() => {
    return createSealContext({ automatic: true, name: 'preload-global' })
  }, [])

  /** Global context */
  const context = useMemo(() => {
    const context = createSealContext<LifeCycleAction & ContainerAction>({
      name: 'global',
    })
    return new Proxy(context, {
      get(target, p, receiver) {
        if (preload.current) {
          return Reflect.get(preloadContext, p, receiver)
        }
        return Reflect.get(target, p, receiver)
      },
    })
  }, [])

  /**
   * 模板初始化
   *
   * 所谓模板，是整个页面渲染的架构和基础，在组件渲染的生命周期中，
   * 模板数据是不可变的。
   *
   * 所有可能会显示的组件都应该包含在模板数据中，通过控制其可见性来切换显示，
   * 而不是修改模板数据。
   *
   * SealContainer 通过一次性渲染所有的模板，并加载其组件所包含的事件。
   * 如果在组件渲染生命周期中修改了模板，排除掉渲染带来的性能影响外，
   * 事件的加载和触发也可能带来不可预计的错误。
   *
   * 设计原子组件时，应该自身缓存所有的设置参数，并提供修改接口。
   * eg. ctx.on('set_attr', (attrs) => {...})
   *
   * 所以模板初始化只需要执行一次。
   */
  useEffect(() => {
    if (ready.current) {
      return () => {}
    }

    preload.current = true
    props.setup?.(context)

    const abort = { current: false }
    /**
     * 模板加载完成，渲染模板
     */
    const templateReady = async (template: SealNode[]) => {
      if (abort.current) return
      const modified = await context.exec('template_ready', template ?? [])
      const elements = renderItems(modified ?? template ?? [])
      setRendered(elements)
      preload.current = false
    }

    const fetchTemplate = async () => {
      return new Promise<SealNode[]>((resolve, reject) => {
        if (abort.current) {
          return reject()
        }

        const itemsPromise =
          typeof props.items === 'function'
            ? props.items()
            : Promise.resolve(props.items ?? [])

        Promise.resolve(itemsPromise).then(resolve)
      })
    }

    fetchTemplate().then(templateReady)

    return () => {
      abort.current = true
      deepClear(context)
    }
  }, [])

  /**
   * 迁移监听事件，将预加载的事件循环注入到正式上下文中
   */
  const migrated = useRef(false)
  useEffect(() => {
    if (ready.current && !migrated.current) {
      // 迁移
      migrateSchema(context, preloadContext)
      deepClear(preloadContext)
      migrated.current = true
      setAction(createElement(SealAction, { key: 'seal-action' }))
    }
    return () => {}
  }, [ready.current])

  /**
   * 开发阶段，文件改变时自动重载事件
   */
  useEffect(() => {
    if (ready.current) {
      props.setup?.(context)
    }
    return () => {
      if (ready.current) {
        deepClear(context)
      }
    }
  }, [props.setup])

  return createElement(ContextProvider, { value: context }, [action, rendered])
}

export interface SealFunctionComponent<P = AnyObject, C = ContextSchema>
  extends FunctionComponent<P> {
  ctx?: C
}

export type SFC<P = AnyObject, C = ContextSchema> = SealFunctionComponent<P, C>
