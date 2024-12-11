import { ContextSchema, SFC } from '@seal-container/react-render'
import { Input, type InputProps } from 'antd'

export type TextAction = {
  //
}

export type TextSchema = ContextSchema<TextAction>

export interface TextProps extends InputProps {}

const Text: SFC<TextProps> = () => {
  return <Input></Input>
}

if (process.env.NODE_ENV !== 'production') {
  Text.displayName = 'Text'
}

export default Text
