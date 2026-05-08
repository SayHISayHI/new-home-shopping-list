<script setup lang="ts">
interface Props {
  modelValue: number;
  readonly?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const setRating = (rating: number) => {
  if (props.readonly) return;
  emit('update:modelValue', rating);
};
</script>

<template>
  <div class="flex items-center space-x-1.5">
    <template v-for="i in 5" :key="i">
      <div 
        class="relative cursor-pointer select-none group transition-transform duration-500 hover:scale-110"
        @click="setRating(i)"
      >
        <span 
          class="text-lg font-light transition-colors duration-700"
          :class="modelValue >= i - 0.5 ? 'text-[#a67c52]' : 'text-gray-200'"
        >
          {{ modelValue >= i ? '✦' : (modelValue >= i - 0.5 ? '✧' : '✧') }}
        </span>
        <div 
          v-if="!readonly"
          class="absolute inset-0 w-1/2 h-full z-10"
          @click.stop="setRating(i - 0.5)"
        ></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
span {
  font-family: serif;
}
</style>
