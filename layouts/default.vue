<script setup lang="ts">
// const route = useRoute()

const links = [
  [{
    label: 'Home',
    icon: 'i-heroicons-home-solid',
    to: '/',
  }, {
    label: 'Color Extractor',
    icon: 'i-heroicons-command-line',
    to: '/color-extractor',
  }],
  [{
    label: 'Windify',
    icon: 'i-heroicons-light-bulb',
    to: '/windify',
  },
  ],
]
</script>

<template>
  <div>
    <UHorizontalNavigation :links="links" class="border-b border-gray-500 px-4" />
    <main class="h-full px-10 py-8">
      <slot />
    </main>
  </div>
</template>
