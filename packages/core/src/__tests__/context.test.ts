import { Context } from '../context'

describe('Register child schema', () => {
  const context = new Context({ name: 'root' })

  vi.stubGlobal('console', {
    ...console,
    warn: vi.fn(),
  })
  const warnSpy = vi.spyOn(console, 'warn')

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('Unregister component', () => {
    context.get('testNode')
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  test('Register child', () => {
    const childContext = new Context<any, any>({ name: 'child' })
    context.set('testNode', childContext)
    context.get('testNode')
    expect(warnSpy).toHaveBeenCalledTimes(0)
  })

  test('Repeat registered component', () => {
    const childContext = new Context<any, any>({ name: 'child' })
    context.set('testNode', childContext)
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  test('Unset registered component', () => {
    context.unset('testNode')
    context.get('testNode')
    expect(warnSpy).toHaveReturnedTimes(1)
  })
})

describe('Auto register component', () => {
  const context = new Context({ name: 'root', automatic: true })

  const warnSpy = vi.spyOn(console, 'warn')

  afterEach(() => {
    vi.clearAllMocks()
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })

  test('Get unregister component', () => {
    context.get('testNode')
    expect(warnSpy).toHaveBeenCalledTimes(0)
  })
})

describe('Run action', () => {
  const context = new Context({ name: 'root' })

  const print = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })

  test('Execute action before register', async () => {
    expect(async () => await context.exec('test')).not.toThrowError()
  })

  test('Execute registered action', async () => {
    context.on('test', print)
    await context.exec('test', 'test log...')
    expect(print).toHaveBeenCalledTimes(1)
    expect(print).toHaveBeenCalledWith('test log...')
  })

  test('Remove action', async () => {
    context.rm('test', print)
    await context.exec('test')
    expect(print).toHaveBeenCalledTimes(0)
  })
})
