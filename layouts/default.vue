<template>
  <div class="min-h-screen flex flex-col">
    <!-- Skip to main content link -->
    <a
      href="#main-content"
      class="skip-link"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>

    <!-- Page Content -->
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0284c7;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}
</style>
