<script setup lang="ts">
interface Props {
  amount: number
}
defineProps<Props>()
</script>

<template>
  <div tw="h-full w-full flex items-center justify-center" style="font-family: degular">
    <div tw="flex flex-col items-center justify-center w-full h-full">
      <h1 tw="flex items-center justify-center">
        <span tw="text-[72px]">+</span>
        <span class="relative">
          <span
            tw="text-[140px] text-[#000] h-[140px] -mt-16"
            style="
                text-shadow: 5px 5px 0 #000,
                 -2px -2px 0 #000,
                 2px 2px 0 #000,
                 -2px 2px 0 #000,
                 2px -2px 0 #000,
                 -1px -1px 1px #000,
                 1px 1px 1px #000,
                 -1px 1px 1px #000,
                 1px -1px 1px #000;
            "
          >${{ amount.toFixed(2) }}</span>
          <span
            tw="text-[140px] text-[#ADFC4F] h-[140px] -mt-16 absolute top-0 left-0"
          >${{ amount.toFixed(2) }}</span>
        </span>
        <span tw="text-[72px] text-transparent">+</span>
      </h1>
      <div tw="text-[24px]">
        {{ (amount) * 100 }} in Tokens
      </div>
    </div>
  </div>
</template>
