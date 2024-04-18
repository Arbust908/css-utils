<script lang="ts" setup>
import { findTailwindColor, getColorName } from '@/constants/NameColorJavaScript'

const cssText = ref('')
const { getColorsFromText } = useColorExtractor(cssText.value)
const extractedColorsList = computed(() => {
  if (!cssText.value)
    return [[], [], []]
  const { hexColors, rgbColors, namedColors } = getColorsFromText(cssText.value)
  console.log('extractedColorsList', hexColors, rgbColors, namedColors)
  if (!hexColors.length && !rgbColors.length && !namedColors.length)
    return [[], [], []]

  return [(hexColors), (rgbColors), (namedColors)]
})

const colorsToTW = computed(() => {
  const [hexColors, rgbColors, namedColors] = extractedColorsList.value
  const colors = [...new Set([...hexColors, ...rgbColors, ...namedColors])]
  return colors.map((color) => {
    const colorName = getColorName(color)
    const colorTWized = findTailwindColor(color)
    return {
      ...colorTWized,
      originalColorName: colorName,
    }
  })
})
</script>

<template>
  <div>
    <article class="grid min-h-full gap-3 md:grid-cols-3">
      <UTextarea
        v-model="cssText"
        autoresize
        placeholder="Add your css here..."
      />
      <UCard
        class="col-span-2"
      >
        <div class="grid grid-cols-2 gap-3">
          <div v-for="color in colorsToTW" :key="color.originalColor" class="grid grid-cols-[2fr,48px,2fr,52px] items-center gap-x-2" :class="color.isExact ? 'ring-2 ring-emerald-500' : ''">
            <span class="text-right">{{ color.originalColorName }}</span>
            <div class="flex overflow-clip rounded">
              <div class="h-6 w-6" :style="{ backgroundColor: color.originalColor }" />
              <div class="h-6 w-6" :style="{ backgroundColor: color.closestColor }" />
            </div>
            <span class="text-left">{{ color.name }}</span>
            <span class="text-xs">{{ color.distance }}</span>
          </div>
        </div>
      </UCard>
    </article>
  </div>
</template>
