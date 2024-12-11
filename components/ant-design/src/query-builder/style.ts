import {
  FullToken,
  GenerateStyle,
  GetDefaultToken,
  genStyleHooks,
} from '../_utils/theme'

export interface ComponentToken {
  defaultHeight: number
}

type QueryBuilderToken = FullToken<'QueryBuilder'>

const genSharedQueryBuilderStyle: GenerateStyle<QueryBuilderToken> = (
  token,
) => {
  const { componentCls, defaultHeight } = token
  return {
    [componentCls]: {
      display: 'flex',
      height: defaultHeight,
      padding: '0 16px',
      alignItems: 'center',
      gap: 8,
    },
  }
}

const prepareComponentToken: GetDefaultToken<'QueryBuilder'> = () => ({
  defaultHeight: 48,
})

export default genStyleHooks(
  'QueryBuilder',
  (token) => [genSharedQueryBuilderStyle(token)],
  prepareComponentToken,
)
