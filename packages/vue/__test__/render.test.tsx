import { mount } from '@vue/test-utils'
import { SealContainer, SealNode, defineSealSetup } from '../src'
import * as components from './components'
import { ButtonSchema } from './components/Button'
import { CountSchema } from './components/Count'
import { waiting } from './testUtil'

describe('Render Vue Seal Container', () => {
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

    const wrapper = mount(SealContainer, {
      props: { components, items },
    })

    await waiting()
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div><button>-</button><span>0</span><button>+</button></div>
      <button>++</button>"
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

    const wrapper = mount(SealContainer, {
      props: { components, items },
    })

    await waiting()
    expect(wrapper.html()).toMatchInlineSnapshot(`
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

    const wrapper = mount(SealContainer, {
      props: { components, items, setup },
    })

    await waiting()
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('span').text()).toBe('-1')
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
          code: '+',
          label: '+',
        },
      },
      {
        key: '++',
        type: 'Button',
        props: {
          code: '++',
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

    const wrapper = mount(SealContainer, {
      props: { components, items, setup },
    })

    await waiting()

    await wrapper.find('button[code=+]').trigger('click')
    expect(wrapper.find('span').text()).toBe('1')
    await wrapper.find('button[code=++]').trigger('click')
    expect(wrapper.find('span').text()).toBe('3')
    expect(onIncrement).toBeCalledTimes(2)
  })
})
