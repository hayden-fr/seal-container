import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  createElement,
} from 'react'

interface BoxProps {
  type?: 'div' | 'h1' | 'p'
  className?: string
  style?: CSSProperties
  content?: ReactNode
  children?: ReactNode
}

const Box: FunctionComponent<BoxProps> = (props) => {
  return createElement(
    props.type ?? 'div',
    { className: props.className, style: props.style },
    props.content ?? props.children,
  )
}

export default Box
