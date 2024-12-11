import { ContextSchema, SFC, useSealAction } from '@seal-container/react-render'
import classNames from 'classnames'
import React, { useContext, useMemo, useState } from 'react'
import { ConfigContext } from '../_utils/config-provider'
import { ValidateElement } from '../_utils/interface'
import useStyle from './style'

export type HeaderAction = {
  set_title: (title: React.ReactNode) => void
}

export type HeaderSchema = ContextSchema<HeaderAction>

export interface HeaderMeta {
  key: string
  slot?: 'title'
}

export interface HeaderProps {
  title?: React.ReactNode
  sticky?: boolean
  rootClassName?: string
  children?: React.ReactNode
}

const Header: SFC<HeaderProps, HeaderSchema> = (props) => {
  const { rootClassName, sticky, children } = props

  const { getPrefixCls } = useContext(ConfigContext)

  const prefixCls = getPrefixCls('header')

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

  const wrapperCls = classNames(hashId, cssVarCls, prefixCls, rootClassName, {
    sticky,
  })
  const titleWrapperCls = classNames(`${prefixCls}-title`)
  const extraWrapperCls = classNames(`${prefixCls}-extra`)

  const [title, setTitle] = useState(props.title)

  useSealAction<HeaderAction>((ctx) => {
    ctx.on('set_title', (title) => {
      setTitle(title)
    })
  })

  const { titleDom, extraDom } = useMemo(() => {
    let titleDom: ValidateElement | null = null
    const extraDom: ValidateElement[] = []

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const { slot } = child.props.value as HeaderMeta
        if (slot === 'title') {
          titleDom = child
        } else {
          extraDom.push(child)
        }
      }
    })

    return { titleDom, extraDom }
  }, [children])

  return wrapCSSVar(
    <div className={wrapperCls}>
      <span className={titleWrapperCls}>
        <span>{title}</span>
        <span>{titleDom}</span>
      </span>
      <span className={extraWrapperCls}>{extraDom}</span>
    </div>,
  )
}

if (process.env.NODE_ENV !== 'production') {
  Header.displayName = 'Header'
}

export default Header
