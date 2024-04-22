import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import { makeDynamicTokens } from '../utils/makeDynamicTokens'
import { validateAmountQuery } from '../utils/validateAmountQuery'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const amount = validateAmountQuery(query)
  const svg = await makeDynamicTokens(amount)
  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  setHeader(event, 'Content-Type', 'image/png')

  return png
})
