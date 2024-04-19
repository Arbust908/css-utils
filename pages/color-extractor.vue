<script lang="ts" setup>
import { getColorName } from '@/constants/NameColorJavaScript'

const cssText = ref('')
const { getColorsFromText } = useColorExtractor(cssText.value)
const extractedColorsList = computed(() => {
  if (!cssText.value)
    return [[], [], []]
  const { hexColors, rgbColors, namedColors } = getColorsFromText(cssText.value)
  if (!hexColors.length && !rgbColors.length && !namedColors.length)
    return [[], [], []]

  return [(hexColors), (rgbColors), (namedColors)]
})
const colorText = computed(() => {
  const [hexColors, rgbColors, namedColors] = extractedColorsList.value
  let resultingText = ''
  if (hexColors.length) {
    resultingText += ` /* Hex Colors */\n`;
    // Order and deduplicate the colors
    [...new Set(hexColors)]
      .sort()
      .forEach((e) => {
        resultingText += `${e}\n`
      })
  }
  if (rgbColors.length) {
    resultingText += ` /* RGB Colors */\n`;
    [...new Set(rgbColors)]
      .sort()
      .forEach((e) => {
        resultingText += `${e}\n`
      })
  }
  if (namedColors.length) {
    resultingText += ` /* Named Colors */\n`;
    [...new Set(namedColors)]
      .sort()
      .forEach((e) => {
        resultingText += `${e}\n`
      })
  }

  return resultingText
})
const colorsToVars = computed(() => {
  let variableText = ''
  const [hexColors, rgbColors, namedColors] = extractedColorsList.value
  const colors = [...new Set([...hexColors, ...rgbColors, ...namedColors])]
  colors.forEach((color) => {
    const colorName = getColorName(color).toLocaleLowerCase().replaceAll(' ', '-')
    variableText += `--color-${colorName}: ${color};\n`
  })

  return variableText
})
</script>

<template>
  <div>
    <article class="grid min-h-full gap-3 md:grid-cols-3">
      <UTextarea
        v-model="cssText"
        class="max-h-dvh"
        autoresize
        placeholder="Add your css here..."
      />
      <UTextarea
        v-model="colorText"
        class="max-h-dvh"
        autoresize
        disabled
        placeholder="Processed css will be here..."
      />
      <UTextarea
        v-model="colorsToVars"
        class="max-h-dvh"
        autoresize
        disabled
        placeholder="Processed css will be here..."
      />
    </article>
  </div>
</template>
