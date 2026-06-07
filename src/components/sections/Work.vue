<script setup lang="ts">
import WorkSectionItem from "@components/ui/WorkSectionItem.vue";
import { jobs } from "@/data/work";

const workTitle = "Work";
</script>

<template>
  <section className="grid gap-6">
    <h2 className="font-medium text-muted-foreground pb-6">{{ workTitle }}</h2>
    <div className="grid gap-8">
      <WorkSectionItem v-for="job in jobs" :key="job.companyName" v-bind="job" />
    </div>
  </section>
</template>
