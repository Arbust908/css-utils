import { satori } from 'v-satori'
import Image from '@/components/satori/TokenImage.vue'

// https://github.com/wobsoriano/unplugin-font-to-buffer
const fontData = await fetch('https://images.simplycodes.com/fonts/degular/Degular-Bold.woff')
const fontData2Buffer = await fontData.arrayBuffer()

export async function makeDynamicTokens(
  amount: number,
): Promise<string> {
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

  return svg
}
