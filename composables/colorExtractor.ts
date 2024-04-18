export interface ColorExtraction {
  hexColors: string[]
  rgbColors: string[]
  namedColors: string[]
}

function extractColors(text: string): ColorExtraction {
  // Regex for hexadecimal colors
  const hexPattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g
  // Regex for RGB colors
  const rgbPattern = /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/g
  // List of common color names (this list can be expanded)
  const colorNames = ['red', 'green', 'blue', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'grey', 'brown']

  // Find all matches for hex colors
  const hexColors = Array.from(text.matchAll(hexPattern), m => m[0])
  // Find all matches for RGB colors
  const rgbColors = Array.from(text.matchAll(rgbPattern), m => m[0])
  // Filter the text by color names
  const namedColors = colorNames.filter(color => text.toLowerCase().includes(color))

  return { hexColors, rgbColors, namedColors }
}
/* Only colors */
export function extractFromCssVars(text: string): [string, string][] {
  // we need a regex that matches the css variable name and its value
  const cssVarPattern = /--[\w-]+:\s*[^;]+/g
  const cssVars = Array.from(text.matchAll(cssVarPattern), m => m[0])
    .map((cssVar) => {
      const splittedVar = cssVar.split(': ')
      const varName = splittedVar[0].startsWith('--color-') ? splittedVar[0].split('--')[1] : splittedVar[0].split('--')[1]
      const isHex = splittedVar[1].startsWith('#')
      if (isHex)
        return [varName, splittedVar[1]]

      return null
    })
    .filter(Boolean)
  return cssVars as [string, string][]
}

export function useColorExtractor(context?: string) {
  const extractedColors = computed(() => extractColors(context || '') || [])
  const getColorsFromText = (text: string) => extractColors(text)

  return {
    extractedColors,
    getColorsFromText,
  }
}
