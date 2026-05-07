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
  <div class="flex items-center space-x-3">
    <template v-for="i in 5" :key="i">
      <div 
        class="relative cursor-pointer select-none flex items-center justify-center transition-all duration-700"
        @click="setRating(i)"
      >
        <!-- Ink Mark Marker -->
        <div 
          class="transition-all duration-700"
          :class="[
            modelValue >= i ? 'ink-mark scale-125' : (modelValue >= i - 0.5 ? 'ink-mark opacity-50' : 'ink-mark-empty'),
            !readonly ? 'hover:scale-150' : ''
          ]"
        ></div>
        
        <!-- Half Mark Trigger -->
        <div 
          v-if="!readonly"
          class="absolute inset-y-0 -left-1 w-1/2 z-10"
          @click.stop="setRating(i - 0.5)"
        ></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Individual styles if needed, but classes are in style.css */
.ink-mark, .ink-mark-empty {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
