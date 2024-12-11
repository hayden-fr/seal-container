import {
  ContextSchema,
  ParentComponent,
  SFC,
  useMetaContext,
  useSealAction,
} from '@seal-container/react-render'
import { Button, type ButtonProps } from 'antd'
import React, { useState } from 'react'
import { useLatest } from '../_utils/hooks'

export type ButtonAction = {
  /**
   * @descEN Click event
   * @descCN 点击事件
   */
  click: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  /**
   * @descEN Set the content of the button
   * @descCN 设置按钮显示内容
   */
  set_content: (content: React.ReactNode) => void
  /**
   * @descEN Set the attributes of the button
   * @descCN 设置按钮的属性
   */
  set_attr: (attr: ButtonProps) => void
  /**
   * @descEN Get the attributes of the button
   * @descCN 获取按钮的属性
   */
  get_attr: <T extends readonly (keyof ButtonProps)[]>(
    attrs: T,
  ) => { [P in T[number]]: any }
}

export type ButtonSchema = ContextSchema<ButtonAction>

export interface ButtonWrapperProps extends ButtonProps {}

const ButtonWrapper: SFC<ButtonWrapperProps, ButtonSchema> = (props) => {
  const meta = useMetaContext()

  const { key, name } = meta

  const [content, setContent] = useState<React.ReactNode>(name)
  const [attrs, setAttrs] = useState(props)
  const attrsRef = useLatest(attrs)

  const action = useSealAction<ButtonAction, ParentComponent>((ctx) => {
    ctx.on('set_content', (content) => {
      setContent(content)
    })

    ctx.on('set_attr', (attrs) => {
      setAttrs((val) => {
        return { ...val, ...attrs }
      })
    })

    ctx.on('get_attr', (attrs) => {
      return Object.fromEntries(
        attrs.map((attr) => [attr, attrsRef.current[attr]]),
      )
    })
  })

  return (
    <Button
      {...attrs}
      onClick={async ($event) => {
        try {
          await action.exec('click', $event)
          await action.get('parent').exec('click', key, $event)
        } catch (error) {
          const name = error instanceof Error ? error.name.toLowerCase() : ''
          const level = name === 'abort' ? 'warn' : 'error'
          window.console[level](error)
        }
      }}
    >
      {content}
    </Button>
  )
}

if (process.env.NODE_ENV !== 'production') {
  ButtonWrapper.displayName = 'ButtonWrapper'
}

export default ButtonWrapper
