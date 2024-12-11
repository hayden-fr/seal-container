import {
  GetContextSchema,
  SealContainer,
  SealNode,
  defineSealSetup,
} from '@seal-container/react-render'
import './App.css'
import reactLogo from './assets/react.svg'
import * as components from './components'
import viteLogo from '/vite.svg'

type ComponentType = keyof typeof components

const items: SealNode<ComponentType>[] = [
  {
    key: 'container',
    type: 'Box',
    props: {
      type: 'div',
    },
    children: [
      {
        key: 'viteLogo',
        type: 'Icon',
        props: {
          src: viteLogo,
          href: 'https://vitejs.dev',
          alt: 'Vite logo',
          className: 'logo',
        },
      },
      {
        key: 'reactLogo',
        type: 'Icon',
        props: {
          src: reactLogo,
          href: 'https://react.dev',
          alt: 'React logo',
          className: 'logo react',
        },
      },
    ],
  },
  {
    key: 'title',
    type: 'Box',
    props: {
      type: 'h1',
      content: 'Vite + React',
    },
  },
  {
    key: 'card',
    type: 'Box',
    props: {
      className: 'card',
    },
    children: [
      {
        key: 'counter',
        type: 'Counter',
      },
      {
        key: 'desc',
        type: 'Box',
        props: {
          type: 'p',
          content: (
            <>
              Edit <code>src/App.tsx</code> and save to test HMR
            </>
          ),
        },
      },
    ],
  },
  {
    key: 'toolbar',
    type: 'Box',
    props: {
      className: 'toolbar',
    },
    children: [
      {
        key: 'decrement',
        type: 'Button',
        props: {
          content: 'decrement',
        },
      },
      {
        key: 'increment',
        type: 'Button',
        props: {
          content: 'increment',
        },
      },
    ],
  },
  {
    key: 'docs',
    type: 'Box',
    props: {
      type: 'p',
      className: 'read-the-docs',
      content: 'Click on the Vite and React logos to learn more',
    },
  },
]

type GetSchema<T extends ComponentType> = GetContextSchema<
  (typeof components)[T]
>

type Schema = {
  counter: GetSchema<'Counter'>
  increment: GetSchema<'Button'>
  decrement: GetSchema<'Button'>
}

function App() {
  const setup = defineSealSetup<unknown, Schema>((ctx) => {
    ctx.on('mounted', () => {
      ctx.get('counter').exec('increment')
    })

    ctx.get('counter').on('increment', () => {
      console.log('increment')
    })

    ctx.get('decrement').on('click', () => {
      ctx.get('counter').exec('decrement')
    })

    ctx.get('increment').on('click', () => {
      ctx.get('counter').exec('increment')
    })
  })

  return (
    <SealContainer
      items={items}
      components={components}
      setup={setup}
    ></SealContainer>
  )
}

export default App
