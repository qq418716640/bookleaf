<script setup lang="ts">
export interface BaseCardProps {
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<BaseCardProps>(), {
  shadow: 'md',
  border: false,
  padding: 'md',
  hover: false,
})

const cardClasses = computed(() => {
  const classes = ['bg-white', 'rounded-lg']

  // 阴影
  if (props.shadow !== 'none') {
    classes.push(`shadow-${props.shadow}`)
  }

  // 边框
  if (props.border) {
    classes.push('border', 'border-neutral-200')
  }

  // 内边距
  switch (props.padding) {
    case 'none':
      break
    case 'sm':
      classes.push('p-3')
      break
    case 'md':
      classes.push('p-4')
      break
    case 'lg':
      classes.push('p-6')
      break
  }

  // 悬停效果
  if (props.hover) {
    classes.push('hover:shadow-lg', 'transition-shadow', 'duration-200')
  }

  return classes.join(' ')
})
</script>

<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="mb-16 pb-16 border-b border-neutral-200">
      <slot name="header" />
    </div>

    <div>
      <slot />
    </div>

    <div v-if="$slots.footer" class="mt-16 pt-16 border-t border-neutral-200">
      <slot name="footer" />
    </div>
  </div>
</template>
