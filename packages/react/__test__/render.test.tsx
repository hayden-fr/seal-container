import { SealNode, defineSealSetup } from '@seal-container/core-runtime'
import '@testing-library/jest-dom'
import { SealContainer } from '../src'
import * as components from './components'
import { ButtonSchema } from './components/Button'
import { CountSchema } from './components/Count'
import { act, render, screen, userEvent, waiting } from './testUtils'

describe('Render React Seal Container', () => {
  test('render elements is correctly', async () => {
    const items: SealNode<keyof typeof components>[] = [
      {
        key: 'counter',
        type: 'Count',
      },
      {
        key: 'button',
        type: 'Button',
        props: {
          label: '++',
        },
      },
    ]

    const { container } = await act(() =>
      render(<SealContainer components={components} items={items} />),
    )

    await waiting()
    expect(container.innerHTML).toMatchInlineSnapshot(`
      "<div><button>-</button><span>0</span><button>+</button></div><button>++</button>"
    `)
  })

  test('render elements nest is correctly', async () => {
    const items: SealNode<keyof typeof components>[] = [
      {
        key: 'counter',
        type: 'Count',
        children: [
          {
            key: 'inc',
            type: 'Button',
            meta: {
              slot: 'decrement',
            },
            props: {
              label: '--',
            },
          },
          {
            key: 'dec',
            type: 'Button',
            meta: {
              slot: 'increment',
            },
            props: {
              label: '++',
            },
          },
        ],
      },
    ]

    const { container } = await act(() =>
      render(<SealContainer components={components} items={items} />),
    )

    await waiting()
    expect(container.innerHTML).toMatchInlineSnapshot(`
      "<div><button>--</button><span>0</span><button>++</button></div>"
    `)
  })
})

describe('Interaction of Vue Seal Container ', () => {
  test('single component', async () => {
    const items: SealNode<keyof typeof components>[] = [
      {
        key: 'counter',
        type: 'Count',
      },
    ]

    type Schema = {
      counter: CountSchema
    }

    const onDecrement = vi.fn()

    const setup = defineSealSetup<unknown, Schema>((ctx) => {
      ctx.get('counter').on('decrement', onDecrement)
    })

    await act(() =>
      render(
        <SealContainer components={components} items={items} setup={setup} />,
      ),
    )

    await waiting()
    await act(() => userEvent.click(screen.getByText('-')))
    expect(screen.getByText('-1')).toBeInTheDocument()
    expect(onDecrement).toBeCalledTimes(1)
  })

  test('multi components interaction', async () => {
    const items: SealNode<keyof typeof components>[] = [
      {
        key: 'counter',
        type: 'Count',
      },
      {
        key: '+',
        type: 'Button',
        props: {
          label: '+',
        },
      },
      {
        key: '++',
        type: 'Button',
        props: {
          label: '++',
        },
      },
    ]

    type Schema = {
      counter: CountSchema
      '+': ButtonSchema
      '++': ButtonSchema
    }

    const onIncrement = vi.fn()

    const setup = defineSealSetup<unknown, Schema>((ctx) => {
      ctx.get('counter').on('increment', onIncrement)

      ctx.get('+').on('click', () => {
        ctx.get('counter').exec('increment')
      })

      ctx.get('++').on('click', () => {
        ctx.get('counter').exec('increment', 2)
      })
    })

    await act(() =>
      render(
        <SealContainer components={components} items={items} setup={setup} />,
      ),
    )

    await waiting()
    await act(() => userEvent.click(screen.getAllByText('+')[0]))
    expect(screen.getByText('1')).toBeInTheDocument()
    await act(() => userEvent.click(screen.getByText('++')))
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(onIncrement).toBeCalledTimes(2)
  })
})
