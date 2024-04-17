import type { RenderOptions, queries } from '@testing-library/react'
import { render } from '@testing-library/react'
import React, { StrictMode } from 'react'

const customerRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, { wrapper: StrictMode, ...options })
}

export { customerRender as render }
export type { queries }

export const waiting = async (timing = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timing)
  })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
