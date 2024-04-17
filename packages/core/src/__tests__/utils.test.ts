import {
  createSealContext,
  deepClear,
  defineSealSetup,
  migrateSchema,
} from '../index'
import type { ActionExecuteFn } from '../types'

describe('Define setup fn', () => {
  test('should define setup fn', () => {
    const setup = vi.fn()
    const setupFn = defineSealSetup(setup)
    expect(setupFn).toBe(setup)
  })
})

describe('Migrate and clear action', () => {
  vi.stubGlobal('console', {
    warn: vi.fn(),
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
  afterAll(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const targetContext = createSealContext({ name: 'target' })
  const sourceContext = createSealContext({ name: 'source', automatic: true })

  interface ContextStore {
    action: Map<string, any[]>
    component: Map<string, any>
  }

  const print = vi.fn()

  // setup source action
  sourceContext.on('test1', print)
  sourceContext.on('test2', print)
  sourceContext.on('test2', print)
  sourceContext.on('test3', print)

  sourceContext.get('child1').on('test1', print)
  sourceContext.get('child1').on('test2', print)
  sourceContext.get('child1').on('test2', print)
  sourceContext.get('child1').on('test3', print)
  sourceContext.get('child1').on('test3', print)
  sourceContext.get('child1').on('test3', print)

  sourceContext.get('child2').on('test1', print)
  sourceContext.get('child2').on('test2', print)
  sourceContext.get('child2').on('test3', print)
  sourceContext.get('child2').on('test4', print)

  sourceContext.get('child3').on('test1', print)
  sourceContext.get('child3').on('test2', print)
  sourceContext.get('child3').on('test3', print)
  sourceContext.get('child3').on('test4', print)

  sourceContext.get('child1').get('grand1').on('test1', print)
  sourceContext.get('child1').get('grand1').on('test2', print)
  sourceContext.get('child1').get('grand1').on('test2', print)
  sourceContext.get('child1').get('grand1').on('test3', print)
  sourceContext.get('child1').get('grand1').on('test4', print)

  sourceContext.get('child1').get('grand2').on('test4', print)

  // setup target schema
  const builtIn = vi.fn() as ActionExecuteFn
  builtIn.builtIn = true
  // setup child1
  const child1Context = createSealContext({ name: 'child1' })
  targetContext.set('child1', child1Context)
  child1Context.set('parent', targetContext)
  child1Context.on('test1', builtIn)
  child1Context.on('test4', builtIn)
  // setup child1-grand2
  const grand2Context = createSealContext({ name: 'grand2' })
  child1Context.set('grand2', grand2Context)
  grand2Context.set('parent', child1Context)
  grand2Context.on('test1', builtIn)
  // setup child4
  const child4Context = createSealContext({ name: 'child4' })
  targetContext.set('child4', child4Context)
  child4Context.set('parent', targetContext)

  test('Migrate action', async () => {
    migrateSchema(targetContext, sourceContext)

    const targetStore = targetContext as unknown as ContextStore
    expect(targetStore.action.size).toBe(3)
    expect(targetStore.action.get('test1')?.length).toBe(1)
    expect(targetStore.action.get('test2')?.length).toBe(2)
    expect(targetStore.action.get('test3')?.length).toBe(1)
    expect(targetStore.component.size).toBe(2)
    expect(targetStore.component.get('child1')).toBe(child1Context)
    expect(targetStore.component.get('child4')).toBe(child4Context)

    const child1Store = child1Context as unknown as ContextStore
    expect(child1Store.action.size).toBe(4)
    expect(child1Store.action.get('test1')?.length).toBe(2)
    expect(child1Store.action.get('test2')?.length).toBe(2)
    expect(child1Store.action.get('test3')?.length).toBe(3)
    expect(child1Store.action.get('test4')?.length).toBe(1)
    expect(child1Store.component.size).toBe(2)
    expect(child1Store.component.get('grand2')).toBe(grand2Context)
    expect(child1Store.component.get('parent')).toBe(targetContext)

    const grand2Store = grand2Context as unknown as ContextStore
    expect(grand2Store.action.size).toBe(2)
    expect(grand2Store.action.get('test1')?.length).toBe(1)
    expect(grand2Store.action.get('test4')?.length).toBe(1)
    expect(grand2Store.component.size).toBe(1)
    expect(grand2Store.component.get('parent')).toBe(child1Context)

    const child4Store = child4Context as unknown as ContextStore
    expect(child4Store.action.size).toBe(0)
    expect(child4Store.component.size).toBe(1)
    expect(child4Store.component.get('parent')).toBe(targetContext)
  })

  test('Clear action', () => {
    deepClear(targetContext)

    const targetStore = targetContext as unknown as ContextStore
    expect(targetStore.action.size).toBe(0)

    const child1Store = child1Context as unknown as ContextStore
    expect(child1Store.action.size).toBe(2)
    expect(child1Store.action.get('test1')?.length).toBe(1)
    expect(child1Store.action.get('test4')?.length).toBe(1)

    const grand2Store = grand2Context as unknown as ContextStore
    expect(grand2Store.action.size).toBe(1)
    expect(grand2Store.action.get('test1')?.length).toBe(1)

    const child4Store = child4Context as unknown as ContextStore
    expect(child4Store.action.size).toBe(0)
  })
})
