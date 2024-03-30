const message: Record<string, Record<string, string>> = {
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

const currentLanguage = {
  locale: defaultLanguage,
  message: message[defaultLanguage] ?? message.en,
}

type ValueType = string | number

const castObject = (val: Record<string, any> | any[]) => {
  if (Array.isArray(val)) {
    return Object.fromEntries(val.entries())
  }
  return val
}

export function t(
  key: string,
  variables?: Record<string, ValueType> | ValueType[],
) {
  let template = currentLanguage.message[key] ?? key
  const object = castObject(variables ?? {})
  for (const key in object) {
    template = template.replace(`\${${key}}`, object[key])
  }
  return template
}
