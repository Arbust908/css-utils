<script setup lang="ts">
defineProps({
  amount: String,
})
</script>

<template>
  <div tw="h-full w-full flex items-center justify-center" style="font-family: degular">
    <div tw="flex flex-col items-center justify-center w-full h-full">
      <h1 tw="flex items-center justify-center">
        <span tw="text-[72px]">+</span>
        <span
          tw="text-[140px] text-[#ADFC4F] h-[140px] -mt-16"
          style="
            text-shadow: 4px 4px 0 #000;
            -webkit-text-stroke-width: 2;
            -webkit-text-stroke-color: #000;
          "
        >${{ amount }}</span>
        <span tw="text-[72px] text-transparent">+</span>
      </h1>
      <div tw="text-[24px]">
        {{ Number(amount) * 100 }} in Tokens
      </div>
    </div>
  </div>
</template>
