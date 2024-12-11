import { SFC } from '@seal-container/react-render'
import React from 'react'

export interface SplitterProps {
  rootClassName?: string
  children?: React.ReactNode
}

const Splitter: SFC<SplitterProps> = () => {
  return <div></div>
}

if (process.env.NODE_ENV !== 'production') {
  Splitter.displayName = 'Splitter'
}

export default Splitter
