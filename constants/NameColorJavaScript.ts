import type { hexAndNameMap } from './ColorLists'
import { _hexAndColor, tailwindColors } from './ColorLists'

/* converts a hex string into a RGB array */
export function parseColor(inputColor: string): [number, number, number] {
  const color = inputColor.startsWith('#') ? inputColor : `#${inputColor}`
  if (color.length === 4) {
    return [
      Number.parseInt(color.substring(1, 2).repeat(2), 16),
      Number.parseInt(color.substring(2, 3).repeat(2), 16),
      Number.parseInt(color.substring(3, 4).repeat(2), 16),
    ]
  }

  return [
    Number.parseInt(color.substring(1, 3), 16),
    Number.parseInt(color.substring(3, 5), 16),
    Number.parseInt(color.substring(5, 7), 16),
  ]
}

/* Calculates the distance between 2 RGB arrays */
export function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  return Math.sqrt(
    (rgb1[0] - rgb2[0]) ** 2
    + (rgb1[1] - rgb2[1]) ** 2
    + (rgb1[2] - rgb2[2]) ** 2,
  )
}

/* takes a hex string converts it to rgb and looks for the closest returning [hex, name, isExact] */
export function findClosestColor(color: string, hexNameList: hexAndNameMap = _hexAndColor, maxDiff: number = 0) {
  const [r, g, b] = parseColor(color)
  let closestColor: any = {}
  let smallestDistance = Number.POSITIVE_INFINITY

  hexNameList.forEach((name, hex) => {
    const [r2, g2, b2] = parseColor(hex)
    const distance = colorDistance([r, g, b], [r2, g2, b2])
    if (distance < smallestDistance) {
      smallestDistance = distance
      const finalHex = hex.startsWith('#') ? hex : `#${hex}`
      closestColor = {
        originalColor: color,
        closestColor: finalHex,
        name,
        isExact: distance === 0,
        distance: distance.toFixed(4),
      }
    }
  })

  return closestColor
}

/* converts a hex color into HSL array */
export function toHSL(color: string): [number, number, number] {
  const r = Number.parseInt(color.substring(1, 3), 16) / 255
  const g = Number.parseInt(color.substring(3, 5), 16) / 255
  const b = Number.parseInt(color.substring(5, 7), 16) / 255
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  const delta = max - min
  let h = 0; let s = 0; const l = (min + max) / 2

  if (delta !== 0) {
    s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l))

    switch (max) {
      case r: h = ((g - b) / delta + (g < b ? 6 : 0)); break
      case g: h = ((b - r) / delta + 2); break
      case b: h = ((r - g) / delta + 4); break
    }
    h /= 6
  }
  return [Math.round(h * 255), Math.round(s * 255), Math.round(l * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

export function parseHSL(hslStr: string): { h: number, s: number, l: number } {
  const matches = hslStr.match(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/)
  if (!matches)
    throw new Error('Invalid HSL format')

  const h = Number.parseInt(matches[1])
  const s = Number.parseInt(matches[2])
  const l = Number.parseInt(matches[3])
  return { h, s, l }
}

export function hslToHex(hsl: { h: number, s: number, l: number }): string {
  const { h, s, l } = hsl
  const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100)
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l / 100 - c / 2
  let r = 0; let g = 0; let b = 0

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  }
  else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  }
  else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  }
  else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  }
  else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  }
  else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x
  }

  // Convert RGB from 0-1 to 0-255 by adding m, scaling, and rounding
  const red = Math.round((r + m) * 255)
  const green = Math.round((g + m) * 255)
  const blue = Math.round((b + m) * 255)
  return rgbToHex(red, green, blue)
}

/* Converts an array of [r,g,b] into a #{hex} string */
export function fromRGBtoHex(r: number, g: number, b: number): string {
  // Ensures each color component is within the range of 0 to 255
  const red = Math.max(0, Math.min(255, r))
  const green = Math.max(0, Math.min(255, g))
  const blue = Math.max(0, Math.min(255, b))

  // Convert each color component to a hexadecimal string
  const redHex = red.toString(16).padStart(2, '0')
  const greenHex = green.toString(16).padStart(2, '0')
  const blueHex = blue.toString(16).padStart(2, '0')

  // Concatenate the strings with a # at the beginning
  return `#${redHex}${greenHex}${blueHex}`
}

/* converst a hex string into a color name */
export function hexToName(hex: string): string {
  const hexOnlyNumber = hex.replace('#', '')
  if (_hexAndColor.has(hexOnlyNumber))
    return _hexAndColor.get(hexOnlyNumber) as string
  return findClosestColor(hexOnlyNumber).name
}
/**
 * #Get Color Name
 * This method returns the name of a color based on non-name colors
 * It converts rgb or hsl colors to hex and then finds its ane from the Map or if not found, it finds the closest color
 *
 * @param color in rgb, hsl or hex format
 * @returns color-name
 */
export function getColorName(color: string): string {
  if (color.startsWith('#')) {
    const hex = color.toUpperCase()
    return hexToName(hex)
  }
  else if (color.startsWith('rgb')) {
    const rgbArray = color.match(/\d+/g) as [string, string, string]
    const hex = fromRGBtoHex(...rgbArray.map(Number) as [number, number, number])
    return hexToName(hex)
  }
  else if (color.startsWith('hsl')) {
    const { h, s, l } = parseHSL(color)
    const hex = hslToHex({ h, s, l })
    return hexToName(hex)
  }
  return color
}

export function findTailwindColor(color: string): [string, string, boolean] {
  return findClosestColor(color, tailwindColors)
}
