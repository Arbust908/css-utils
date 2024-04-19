<script lang="ts" setup>
import { useRouteQuery } from "@vueuse/router";
import { findClosestColor, getColorName } from "@/constants/NameColorJavaScript";
import { extractFromCssVars } from "@/composables/colorExtractor";
import { rawTailwindArray } from "@/constants/ColorLists";

const toast = useToast()

const validDiff = ref(0);
const cssText = ref(`.body {
  background: #f5f5f5;
  color: #333;
  font-family: "Raleway", sans-serif;
  font-size: 16px;
  font-weight: 500;
  height: 100%;
  margin: 0;
}
.body__white {
  background: white;
  color: rgb(150, 150, 100);
}
.pp {
  --visious: #696969;
  border: 1px solid #333;
}
`);
const { getColorsFromText } = useColorExtractor(cssText.value);
const extractedColorsList = computed(() => {
    if (!cssText.value) return [[], [], []];
    const { hexColors, rgbColors, namedColors } = getColorsFromText(cssText.value);
    const cssVars = extractVarsFromCss(cssText.value)
    if (!hexColors.length && !rgbColors.length && !namedColors.length)
        return [[], [], []];

    return [hexColors, rgbColors, namedColors, cssVars];
});
const colorsToVars = computed(() => {
    let variableText = "";
    const [hexColors, rgbColors, namedColors, cssVar] = extractedColorsList.value;
    const colors = [...new Set([...hexColors, ...rgbColors, ...namedColors])] as string[];
    colors.forEach((color) => {
        const colorName = getColorName(color).toLocaleLowerCase().replaceAll(" ", "-");
        variableText += `--${colorName}: ${color};\n`;
    });
    cssVar.forEach((color) => {
        const colorName = color[0].toLocaleLowerCase().replaceAll(" ", "-");
        variableText += `--${colorName}: ${color[1]};\n`;
    });
    return variableText;
});
const namedVariableColors = computed(() => {
    if (!colorsToVars.value) return [];
    const extractedNamedVars = extractFromCssVars(colorsToVars.value);
    if (!extractedNamedVars.length) return [];

    return extractedNamedVars;
});
//
const colorOptions = [
    "Slate",
    "Gray",
    "Zinc",
    "Neutral",
    "Stone",
    "Red",
    "Orange",
    "Amber",
    "Yellow",
    "Lime",
    "Green",
    "Emerald",
    "Teal",
    "Cyan",
    "Sky",
    "Blue",
    "Indigo",
    "Violet",
    "Purple",
    "Fuchsia",
    "Pink",
    "Rose",
];
const activeColors = useRouteQuery("colors", [] as string[]);
function toggleColors() {
    activeColors.value = activeColors.value.length ? ["-"] : colorOptions;
}
const togglerText = computed(() =>
    activeColors.value.length ? "Clear All" : "Select All"
);
function toggleColor(colorName: string) {
    if (activeColors.value.includes(colorName))
        activeColors.value = activeColors.value.filter((color) => color !== colorName);
    else activeColors.value = [...activeColors.value, colorName];
}
function isColorActive(colorName: string) {
    return activeColors.value.includes(colorName);
}

interface convertedTwColor {
    name: string;
    closestColor: string;
    originalColor: string;
    originalColorName: string;
    distance: number;
    isExact: boolean;
}
const colorsToTW = computed(() => {
    const filteredTWColors = rawTailwindArray.filter((color) => {
        const colorName = color[1].split("-")[0];
        return activeColors.value.includes(colorName);
    });
    const filteredMap = new Map<string, string>(filteredTWColors);
    return namedVariableColors.value
        .map((color) => {
            const colorName = color[0];
            const colorTWized = findClosestColor(color[1], filteredMap, validDiff.value);
            return {
                ...colorTWized,
                originalColorName: colorName,
            };
        })
        .sort((a, b) => a.name?.localeCompare(b.name)) as convertedTwColor[];
});
interface uniqueColor {
    name: string;
    closestColor: string;
    count: number;
    comments?: string[];
}
const uniqueColor = computed(() =>
    colorsToTW.value
        .reduce((acc: uniqueColor[], color) => {
            const colorIndex = acc.findIndex((item) => item.name === color.name);
            const oldColorIndex = acc.findIndex(
                (item) => item.name === color.originalColorName
            );
            if (colorIndex === -1) {
                acc.push({
                    name: color.name,
                    closestColor: color.closestColor,
                    count: 1,
                    comments: [color.originalColor],
                });
            } else {
                acc[colorIndex].count = acc[colorIndex].count + 1;
                const hasColor = acc[colorIndex].comments?.includes(color.originalColor)
                if (!hasColor) {
                  acc[colorIndex].comments?.push(color.originalColor);
                }
            }
            if (oldColorIndex === -1) {
                acc.push({
                    name: color.originalColorName,
                    closestColor: `var(--${color.name?.toLowerCase()})`,
                    count: 0,
                });
            }

            return acc;
        }, [])
        .sort((a, b) => {
            if ((a.count > 0 && b.count > 0) || (a.count === 0 && b.count === 0))
                return a.name?.localeCompare(b.name);

            return b.count - a.count;
        })
);
const uniqueTailwindColors = computed(() =>
    uniqueColor.value.filter((color) => color.count !== 0)
);

const final_vars = ref<HTMLDivElement>();
function copyAll() {
    if (!final_vars.value) return;

    const text = final_vars.value.textContent;
    // copy to clipboard
    navigator.clipboard
        .writeText(text || "")
        .then(() => {
          toast.add({ title: 'Text copied' })
        })
        .catch((err) => {
          toast.add({ title: 'ERROR: '+ err })
        });
}
onMounted(() => {
    activeColors.value = activeColors.value.length ? activeColors.value : colorOptions;
});
</script>

<template>
    <div class="general-layout">
        <nav class="col-span-full flex flex-wrap gap-2 p-6">
            <UButton
                v-for="color in colorOptions"
                :key="color"
                :color="
                    ['slate', 'zinc', 'neutral', 'stone'].includes(
                        color.toLocaleLowerCase()
                    )
                        ? 'gray'
                        : color.toLowerCase()
                "
                :variant="isColorActive(color) ? 'solid' : 'soft'"
                @click="toggleColor(color)"
            >
                {{ color }}
            </UButton>
            <UButton color="gray" variant="outline" @click="toggleColors">
                {{ togglerText }}
            </UButton>
            <UInput v-model="validDiff" type="number" step="5" label="Valid Diff" />
        </nav>
        <UCard class="col-span-1">
            <section class="grid grid-cols-2 gap-2">
                <div
                    v-for="color in uniqueTailwindColors"
                    :key="color.closestColor"
                    class="grid grid-cols-[16px,16px,1fr] items-center gap-1"
                >
                    <div>
                        {{ color.count }}
                    </div>
                    <div class="flex overflow-clip rounded">
                        <div
                            class="h-4 w-4"
                            :style="{ backgroundColor: color.closestColor }"
                        />
                    </div>
                    <span class="text-left text-xs">{{ color.name }}</span>
                </div>
            </section>
        </UCard>
        <UCard class="col-span-2">
            <div class="grid grid-cols-2 gap-3">
                <div
                    v-for="color in colorsToTW"
                    :key="color.originalColor"
                    class="grid grid-cols-[1fr,48px,110px,52px] items-center gap-x-2 rounded p-1"
                    :class="color.isExact ? 'ring-2 ring-emerald-500' : ''"
                >
                    <div class="text-right">
                        <p>
                            {{ color.originalColorName }}
                        </p>
                        <p class="text-xs opacity-70">
                            {{ color.originalColor }}
                        </p>
                    </div>
                    <div class="flex overflow-clip rounded">
                        <div
                            class="h-6 w-6"
                            :style="{ backgroundColor: color.originalColor }"
                        />
                        <div
                            class="h-6 w-6"
                            :style="{ backgroundColor: color.closestColor }"
                        />
                    </div>
                    <div class="text-left">
                        <p>
                            {{ color.name }}
                        </p>
                        <p class="text-xs opacity-70">
                            {{ color.closestColor }}
                        </p>
                    </div>
                    <span class="text-xs">{{ color.distance }}</span>
                </div>
            </div>
        </UCard>
        <UCard class="relative col-span-1">
            <UIcon
                name="i-heroicons-clipboard-document-list-20-solid"
                class="absolute right-6 top-6 h-8 w-8 bg-gray-50 text-white"
                @click="copyAll"
            />
            <div ref="final_vars" class="text-left text-xs text-gray-400">
                <p
                    v-for="{ name, closestColor, comments, count } in uniqueColor"
                    :key="name + closestColor + count + (comments?.length ?? 0)"
                >
                    --{{ name?.toLowerCase() }}: {{ closestColor }};
                    <template v-if="comments?.length">
                        /*
                        <p v-for="comment in comments" :key="comment + name">
                            {{ comment }}
                        </p>
                        */
                    </template>
                </p>
            </div>
        </UCard>
        <UTextarea
            v-model="cssText"
            class="col-span-2"
            autoresize
            placeholder="Add your css here..."
        />
    </div>
</template>

<style scoped>
.general-layout {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
}
</style>
