<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <UMain>
      <slot />
    </UMain>
    <AppFooter />
  </div>
</template>

<script setup lang="ts"></script>
