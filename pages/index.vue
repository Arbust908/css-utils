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
    label: 'Command Palette',
    icon: 'i-heroicons-command-line',
    to: '/components/command-palette',
  }],
  [{
    label: 'Examples',
    icon: 'i-heroicons-light-bulb',
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
  return processed.css
}
</script>

<template>
  <div class="mx-auto h-full max-w-screen-lg">
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
      <article class="grid h-full gap-3 md:grid-cols-2">
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
