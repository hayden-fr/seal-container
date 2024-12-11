import { GetContextSchema } from '@seal-container/vue-render'
import components from './components'

type ComponentCollection = typeof components

type Schema<T extends keyof ComponentCollection> = GetContextSchema<
  ComponentCollection[T]
>

declare global {
  interface Schema$App {
    hello: Schema<'HelloWorld'>
  }
}
