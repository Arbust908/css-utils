<script setup lang="ts">
import postcss from 'postcss'
import myPlugin from '@/myPlugin'

const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4',
    },
  }],
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: () => {
      console.log('Edit')
    },
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['D'],
    disabled: true,
  }],
  [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid',
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid',
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D'],
  }],
]
const route = useRoute()

const links = [
  [{
    label: 'Installation',
    icon: 'i-heroicons-home',
    to: '/getting-started/installation',
  }, {
    label: 'Horizontal Navigation',
    icon: 'i-heroicons-chart-bar',
    to: `${route.path.startsWith('/dev') ? '/dev' : ''}/components/horizontal-navigation`,
  }, {
    label: 'Color Extractor',
    icon: 'i-heroicons-command-line',
    to: '/color-extractor',
  }],
  [{
    label: 'Windify',
    icon: 'i-heroicons-light-bulb',
    to: '/windify',
  }, {
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
  }],
]

const isDisabled = ref(false)
const toast = useToast()

const toProcessCss = ref('')
const processedCss = ref('')
const processor = postcss([myPlugin])
function onProcess(css: string) {
  const processed = processor.process(css)
  processedCss.value = processed.css
}

onMounted(() => {
  toProcessCss.value = `@viewport{width:device-width}html{box-sizing:border-box;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}*,::after,::before{box-sizing:inherit}h1,p{margin:0;padding:0}h1{font-size:inherit}img{border:0;height:auto;max-width:100%}a{color:inherit}a{text-decoration:none;-webkit-text-decoration-skip:objects}::placeholder{color:inherit;opacity:.25}::-moz-focus-inner{border:0;padding:0}html{height:100%}.body{background:#f8f8f8;color:#222;font-family:niveau-grotesk,sans-serif;font-style:normal;font-size:14px;height:100%;margin:0}::placeholder{color:#555;font-size:15px;font-weight:400;opacity:1}a{text-decoration:none;color:#028f00}h1{font-size:30px}h1{font-family:prometo,sans-serif;margin-bottom:30px;line-height:normal;font-weight:500}p{margin-bottom:20px}@media only screen and (max-width:1000px){.flex--container{flex-wrap:wrap}}@media only screen and (max-width:500px){body h1{text-align:center;font-size:22px}}.dblock{display:block}.mrauto{margin-right:auto}.mb8{margin-bottom:8px}.mb30{margin-bottom:30px}.mlauto{margin-left:auto}.bgf{background:#fff}.pd10{padding:10px}.fs16{font-size:16px}.tacenter{text-align:center}.flex--container{display:flex;flex-direction:row}.flex--centered{align-items:center;justify-content:center}.flex--jc--center{justify-content:center}`
})
</script>

<template>
  <div class="mx-auto min-h-full max-w-screen-lg">
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
    <section>
      <div class="flex justify-between py-4">
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }" disabled>
          <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdown>
        <div class="flex gap-x-2">
          <UButton label="Show toast" @click="toast.add({ title: 'Hello world!' })" />
          <UButton label="Process" @click="onProcess(toProcessCss)" />
        </div>
      </div>
      <article class="grid min-h-full gap-3 md:grid-cols-2">
        <UTextarea
          v-model="toProcessCss"
          :disabled="isDisabled"
          autoresize
          placeholder="Add your css here..."
        />
        <UTextarea
          v-model="processedCss"
          autoresize
          disabled
          placeholder="Processed css will be here..."
        />
      </article>
    </section>
  </div>
</template>
