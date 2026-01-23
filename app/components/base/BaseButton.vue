<script setup lang="ts">
export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes = ['btn-base']

  // 变体样式
  switch (props.variant) {
    case 'primary':
      classes.push('btn-primary')
      break
    case 'secondary':
      classes.push('btn-secondary')
      break
    case 'ghost':
      classes.push('btn-ghost')
      break
    case 'danger':
      classes.push('btn-danger')
      break
  }

  // 尺寸样式
  switch (props.size) {
    case 'sm':
      classes.push('btn-sm')
      break
    case 'md':
      classes.push('btn-md')
      break
    case 'lg':
      classes.push('btn-lg')
      break
  }

  return classes.join(' ')
})

const isDisabled = computed(() => props.disabled || props.loading)

const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit('click', event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.key === 'Enter' || event.key === ' ') && !isDisabled.value) {
    event.preventDefault()
    emit('click', event as unknown as MouseEvent)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    :aria-disabled="isDisabled"
    :aria-busy="loading"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="loading" class="inline-block animate-spin mr-2" aria-hidden="true">⏳</span>
    <slot />
  </button>
</template>
