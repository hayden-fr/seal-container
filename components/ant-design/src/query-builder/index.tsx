import { SearchOutlined } from '@ant-design/icons'
import { ContextSchema, SFC, useSealAction } from '@seal-container/react-render'
import { Button, Form } from 'antd'
import classNames from 'classnames'
import React, { isValidElement, useContext, useMemo } from 'react'
import { ConfigContext } from '../_utils/config-provider'
import useStyle from './style'

export type QueryBuilderAction = {
  query: () => void
}

export type QueryBuilderSchema = ContextSchema<QueryBuilderAction>

export interface QueryBuilderMeta {
  key: string
  quickQuery?: boolean
}

export interface QueryBuilderProps {
  rootClassName?: string
  children?: React.ReactNode
}

const QueryBuilder: SFC<QueryBuilderProps, QueryBuilderSchema> = (props) => {
  const { getPrefixCls } = useContext(ConfigContext)

  const prefixCls = getPrefixCls('query-builder')

  const { rootClassName, children } = props

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

  const queryCls = classNames(hashId, cssVarCls, prefixCls, rootClassName)

  const quickQueryItems = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (isValidElement(child)) {
        const { quickQuery } = child.props.value as QueryBuilderMeta
        return quickQuery ? child : null
      }
      return null
    })
  }, [props.children])

  useSealAction(() => {})

  return wrapCSSVar(
    <div className={queryCls}>
      <Form layout="inline">
        {quickQueryItems?.map((child) => {
          const meta = child.props.value as QueryBuilderMeta
          return <Form.Item key={meta.key}>{child}</Form.Item>
        })}
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {}}
            icon={<SearchOutlined />}
          ></Button>
        </Form.Item>
        <Form.Item>
          <Button></Button>
        </Form.Item>
      </Form>
    </div>,
  )
}

export default QueryBuilder
