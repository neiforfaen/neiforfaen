<script setup lang="ts">
import Asterisk from "../icons/Asterisk.vue";
</script>

<template>
  <footer class="grid place-items-center">
    <div class="flex items-center gap-6 text-sm text-muted-foreground">
      <a
        href="https://github.com/neiforfaen"
        class="transition-colors hover:text-foreground"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
      <Asterisk :size="16" />
      <span class="text-sm text-center cursor-default">424</span>
      <Asterisk :size="16" />
      <a
        href="https://linkedin.com/in/kaiden-riley"
        class="transition-colors hover:text-foreground"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    </div>
  </footer>
</template>
