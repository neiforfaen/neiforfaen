<script setup lang="ts">
import type { Project } from "@/data/projects";

defineProps<Project>();
</script>

<template>
  <a
    class="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 no-underline"
    :href="url"
    rel="noopener noreferrer"
    target="_blank"
  >
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <p class="font-medium text-foreground transition-colors group-hover:text-muted-foreground">
        {{ name }}
      </p>
      <p class="text-sm text-muted-foreground font-light">{{ description }}</p>
    </div>
  </a>
</template>
