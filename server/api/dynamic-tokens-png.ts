import { Buffer } from 'node:buffer'
import { satori } from 'v-satori'
import sharp from 'sharp'
import Image from '@/components/satori/TokenImage.vue'
// https://github.com/wobsoriano/unplugin-font-to-buffer
// import Roboto from '@/lib/fonts/Roboto-Regular.ttf'
const fontData = await fetch('https://images.simplycodes.com/fonts/degular/Degular-Bold.woff')
const fontData2Buffer = await fontData.arrayBuffer()

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const amount = Array.isArray(query.amount) ? query.amount[0] : query.amount

  const svg = await satori(Image, {
    props: {
      amount,
    },
    width: 520,
    height: 176,
    fonts: [{
      name: 'degular',
      data: fontData2Buffer,
      weight: 500,
      style: 'normal',
    }],
  })
  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  setHeader(event, 'Content-Type', 'image/png')

  return png
})
