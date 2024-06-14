export const waiting = async (timing = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timing)
  })
}
