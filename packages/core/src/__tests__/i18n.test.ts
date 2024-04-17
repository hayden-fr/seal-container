import { config, t } from '../i18n'

describe('i18n', () => {
  const originalLocal = config.locale
  afterEach(() => {
    config.locale = originalLocal
  })

  test('Zh-CN', () => {
    config.locale = 'zh'
    expect(t('notBeenRegistered', ['test'])).toBe('实例 "test" 未注册。')
  })

  test('En-US', () => {
    config.locale = 'en'
    expect(t('notBeenRegistered', ['test'])).toBe(
      'Instance "test" has not been registered',
    )
  })

  test('Other', () => {
    config.locale = 'ot'
    expect(t('notBeenRegistered', ['test'])).toBe(
      'Instance "test" has not been registered',
    )
  })
})
