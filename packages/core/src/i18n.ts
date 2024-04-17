interface LocalMessage {
  hasBeenRegistered: string
  notBeenRegistered: string
}

const message: Record<string, LocalMessage> = {
  en: {
    hasBeenRegistered:
      'Instance "${0}" has been registered, and the previous instance will be covered.',
    notBeenRegistered: 'Instance "${0}" has not been registered',
  },
  zh: {
    hasBeenRegistered: '实例 "${0}" 已注册，之前的实例将被覆盖。',
    notBeenRegistered: '实例 "${0}" 未注册。',
  },
}

const defaultLanguage = navigator.language.split('-')[0]

export const config = {
  locale: defaultLanguage,
}

type ValueType = string | number

export function t(key: keyof LocalMessage, variables: ValueType[] = []) {
  const currentMessage = message[config.locale] ?? message.en
  let template = currentMessage[key]
  for (const index of variables.keys()) {
    template = template.replace(`\${${index}}`, variables[index].toString())
  }
  return template
}
