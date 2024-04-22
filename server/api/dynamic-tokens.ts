import { makeDynamicTokens } from '../utils/makeDynamicTokens'
import { validateAmountQuery } from '../utils/validateAmountQuery'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const amount = validateAmountQuery(query)
  const svg = await makeDynamicTokens(amount)

  setHeader(event, 'Content-Type', 'image/svg+xml')

  return svg
})
