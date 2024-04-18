<script lang="ts" setup>
import { findTailwindColor, getColorName } from '@/constants/NameColorJavaScript'
import { extractFromCssVars } from '@/composables/colorExtractor'

const cssText = ref(`:root {
  /* Font Families */
  --font-w-icons: "Raleway", "Font Awesome 5 Pro";
  --font-default: "Raleway", sans-serif;
  /* zIndex */
  /* z-index: 10000 */
  /* z-index: 1000000 */
  /* z-index: 10000000000 */
  /* z-index: 9000; */
  --max-z: calc(infinity - 1);
  --z-modal: calc(infinity - 10);
  --z-backdrop: calc(infinity - 20);
  --z-50: 50;
  --z-40: 40;
  --z-30: 30;
  --z-20: 20;
  --z-10: 10;
  --z-0: 0;
  --z-1: -1;
  /* Colors */
  --blue-corner: #024f7d;
  --blue-d15-hover: #008de2;
  --blue-d15: #0085d7;
  --blue-light-hover: #26bffe;
  --blue-light: #15affd;
  --darkblue-corner: #012f4b;
  --darkblue-hover: #037fca;
  --darkblue: #036fb0;
  --green-corner: #4d6d13;
  --green-light-hover: #c9e669;
  --green-light: #b8d558;
  --green: #85ba21;
  --orange-d1: #e59f36;
  --orange-hover: #ffc24d;
  --orange: #ffb13c;
  --red-corner: #be4934;
  --red-light-hover: #ff9b86;
  --red-light: #ff8a75;
  --red: #f24f74;
  --yes: #9cdb27;
  --purple: #9535f5;

  /* Brands */
  --amazon-hover: #f3b94a;
  --amazon-orange: #ffbb22;
  --amazon: #f2a839;
  --facebook-hover: #5d7bba;
  --facebook: #3b5998;
  --gmail-2: #d44638;
  --gmail: #c71610;
  --linkedin-2: #4875b4;
  --linkedin-hover: #2299d6;
  --linkedin: #0077b4;
  --pinterest-hover: #f82245;
  --pinterest: #e60023;
  --reddit-hover: #7fbbef;
  --reddit: #5f99cf;
  --tumblr: #35465c;
  --twitter-hover: #22ceff;
  --twitter: #00aced;

  /* Greys */
  --gray-95: #000;
  --gray-90: #111;
  --gray-85: #222;
  --gray-80: #333;
  --gray-75: #444;
  --gray-70: #555;
  --gray-60: #777;
  --gray-55: #888;
  --gray-50: #999;
  --gray-45: #aaa;
  --gray-40: #bbb;
  --gray-35: #ccc;
  --gray-30: #ddd;
  --gray-25: #eee;
  --gray-20: #f2f2f2;
  --gray-15: #f5f5f5;
  --gray-10: #fafafa;
  --gray-5: #fcfcfc;
  --gray-0: #fff;
  /* -|- */

  --color-alto: #dcdcdc;
  --color-anakiwa: #97edfc;
  --color-apricot-white: #fffeed;
  --color-astral: #2f7eb6;
  --color-atlantis: #8cc523;
  --color-azalea: #fbcad5;
  --color-azure-radiance: #009dfc;
  --color-black-haze: #f7f7f7;
  --color-brink-pink: #f35f85;
  --color-candlelight: #ffd01a;
  --color-cararra: #ececec;
  --color-cerulean: #048fe2;
  --color-chrome-white: #ebf8d4;
  --color-citron: #90b21c;
  --color-confetti: #e5dc4f;
  --color-corn: #f2be00;
  --color-dodger-blue: #049ffc;
  --color-fair-pink: #ffe7ec;
  --color-feta: #f5fbea;
  --color-frost: #f0fadf;
  --color-galliano: #d9aa00;
  --color-gossip: #d7f0a9;
  --color-green-yellow: #befd49;
  --color-hawkes-blue: #cfe9fc;
  --color-japanese-laurel: #008000;
  --color-lemon-chiffon: #fffccd;
  --color-lemon: #fff207;
  --color-lily-white: #e5f3fc;
  --color-lochmara: #027dda;
  --color-malachite: #10f24c;
  --color-malibu: #6fbef7;
  --color-mercury: #e5e5e5;
  --color-onahau: #cdecfe;
  --color-pale-prim: #fffbbc;
  --color-pattens-blue: #daf1fe;
  --color-picton-blue: #2fb0fd;
  --color-pig-pink: #fcdce3;
  --color-pink: #f9b8c7;
  --color-remy: #feeef1;
  --color-rice-cake: #fffeef;
  --color-royal-blue: #635bff;
  --color-scotch-mist: #fffdde;
  --color-soft-peach: #f8efee;
  --color-solitude: #ebf7ff;
  --color-sugar-cane: #fafdf4;
  --color-supernova: #ffc800;
  --color-tahuna-sands: #e6f6c9;
  --color-trendy-green: #809f19;
  --color-turquoise-blue: #5fcbf7;
  --color-tusk: #e1f4bf;
}
`)
const namedVariableColors = computed(() => {
  if (!cssText.value)
    return []
  const extractedNamedVars = extractFromCssVars(cssText.value)
  if (!extractedNamedVars.length)
    return []

  return extractedNamedVars
})

const colorsToTW = computed(() => {
  return namedVariableColors.value.map((color) => {
    const colorName = color[0]
    const colorTWized = findTailwindColor(color[1])
    return {
      ...colorTWized,
      originalColorName: colorName,
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
})
const final_vars = ref('')
function copyAll() {
  if (!final_vars.value)
    return

  const text = final_vars.value.textContent
  const uniqueText = Array.from(new Set(text.split(';'))).join(';')

  // copy to clipboard
  navigator.clipboard.writeText(uniqueText)
    .then(() => {
      console.log('Text copied to clipboard')
    })
    .catch((err) => {
      console.error('Error in copying text: ', err)
    })
}
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
          <div v-for="color in colorsToTW" :key="color.originalColor" class="grid grid-cols-[1fr,48px,110px,52px] items-center gap-x-2" :class="color.isExact ? 'ring-2 ring-emerald-500' : ''">
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
    <article class="">
      <UCard class="relative">
        <UIcon name="i-heroicons-clipboard-document-list-20-solid" class="absolute right-6 top-6 h-8 w-8 bg-gray-50 text-white" @click="copyAll" />
        <div ref="final_vars" class="text-left text-xs text-gray-400">
          /* Tailwind colors */
          <p v-for="color in colorsToTW" :key="color.originalColor">
            --{{ color.name.toLowerCase() }}: {{ color.closestColor.toUpperCase() }};
          </p>
          /* Converted colors */
          <p v-for="color in colorsToTW" :key="color.originalColor">
            --{{ color.originalColorName.toLowerCase() }}: var(--{{ color.name.toLowerCase() }});
          </p>
        </div>
      </UCard>
    </article>
  </div>
</template>
