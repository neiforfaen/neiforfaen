<script setup lang="ts">
import { projects } from "@/data/projects";
import ProjectSectionItem from "../ui/ProjectSectionItem.vue";

const projectsTitle = "Projects";
</script>

<template>
  <section class="grid gap-6">
    <h2 class="font-medium text-muted-foreground pb-6">{{ projectsTitle }}</h2>
    <div class="grid gap-6 sm:gap-2">
      <ProjectSectionItem v-for="project in projects" :key="project.name" v-bind="project" />
    </div>
  </section>
</template>
