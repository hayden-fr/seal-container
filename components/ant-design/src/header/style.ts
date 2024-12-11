import {
  FullToken,
  GenerateStyle,
  GetDefaultToken,
  genStyleHooks,
} from '../_utils/theme'

export interface ComponentToken {
  defaultHeight: number
}

type HeaderToken = FullToken<'Header'>

const genSharedHeaderStyle: GenerateStyle<HeaderToken> = (token) => {
  const { componentCls, defaultHeight, colorBorder, zIndexBase } = token

  return {
    [componentCls]: {
      display: 'flex',
      width: '100%',
      height: defaultHeight,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colorBorder,
      padding: '0px 16px',
      overflow: 'hidden',

      ['&.sticky']: {
        position: 'sticky',
        top: 0,
        zIndex: zIndexBase,
      },

      [`${componentCls}-title`]: {
        display: 'flex',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        columnGap: 8,
        fontWeight: 'bold',
      },

      [`${componentCls}-extra`]: {
        display: 'flex',
        height: '100%',
        columnGap: 8,
        alignItems: 'center',
      },
    },
  }
}

const prepareComponentToken: GetDefaultToken<'Header'> = () => ({
  defaultHeight: 48,
})

export default genStyleHooks(
  'Header',
  (token) => [genSharedHeaderStyle(token)],
  prepareComponentToken,
)
