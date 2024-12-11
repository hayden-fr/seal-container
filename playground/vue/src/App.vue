<template>
  <seal-container
    :components="components"
    :items="fetchTemplate"
    :setup="setup"
  ></seal-container>
</template>

<script setup lang="ts">
import {
  SealContainer,
  SealNode,
  createSealContext,
  defineSealSetup,
} from '@seal-container/vue-render'
import components, { ComponentSchemaCollection } from './components'

type Schema = {
  counter_1: ComponentSchemaCollection['hello']
}

const fetchTemplate = (): SealNode[] => {
  return [
    {
      key: 'container',
      type: 'container',
      children: [
        {
          key: 'counter_1',
          type: 'hello',
          props: {
            msg: 'Hello World',
          },
        },
      ],
    },
  ]
}

const docsSetup = defineSealSetup<unknown, Schema>((ctx) => {
  const context = createSealContext()

  context.on('click', () => {
    console.log('click from docs')
    ctx.get('counter_1').exec('increment')
  })

  const handleClick = () => {
    context.exec('click')
  }

  ctx.on('mounted', () => {
    console.log('添加监听事件')
    document
      .querySelector('.read-the-docs')
      ?.addEventListener('click', handleClick)
  })

  ctx.on('unmounted', () => {
    console.log('移除监听事件')
    document
      .querySelector('.read-the-docs')
      ?.removeEventListener('click', handleClick)
  })
})

const templateSetup = defineSealSetup((ctx) => {
  let count = 0

  ctx.on('template_ready', () => {
    count = count + 1
    console.log('template ready', count)
  })
})

const counterSetup = defineSealSetup((ctx) => {
  ctx.get('counter_1').on('increment', () => {
    console.log('customer click increment version 1.2')
  })
})

const defaultSetup = defineSealSetup((ctx) => {
  let count = 0

  ctx.on('mounted', () => {
    count = count + 1
    console.log('init...', count)
    ctx.get('counter_1').exec('increment')
  })

  ctx.on('unmounted', () => {
    console.log('unmounted......')
  })
})

const setup = defineSealSetup<unknown, Schema>(async (ctx) => {
  console.log('run setup...')

  defaultSetup(ctx)
  templateSetup(ctx)
  docsSetup(ctx)
  counterSetup(ctx)
})
</script>
