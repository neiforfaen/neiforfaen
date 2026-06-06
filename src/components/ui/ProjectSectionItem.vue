<script setup lang="ts">
import type { Project } from "@/data/projects";
import ProjectSectionItemBadge from "./ProjectSectionItemBadge.vue";

defineProps<Project>();
</script>

<template>
  <a
    class="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 no-underline"
    :href="url"
    rel="noopener noreferrer"
    target="_blank"
  >
    <div className="flex flex-col w-full sm:flex-row sm:justify-between sm:items-center sm:gap-2">
      <div className="sm:flex sm:flex-row sm:items-center sm:gap-2">
        <p
          className="font-medium text-foreground transition-colors group-hover:text-muted-foreground"
        >
          {{ name }}
        </p>
        <p className="text-sm text-muted-foreground font-light">{{ description }}</p>
      </div>
      <ProjectSectionItemBadge :text="badge" />
    </div>
  </a>
</template>
