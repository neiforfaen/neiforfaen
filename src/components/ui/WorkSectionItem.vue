<script setup lang="ts">
import type { Job } from "@/data/work";

const props = withDefaults(defineProps<Job>(), { imgSize: 24 });

const actualDateRange = `${props.dateRange[0]} → ${props.dateRange[1]}`;
</script>

<template>
  <div class="grid sm:grid-cols-[48px_1fr] gap-4 rounded-xl">
    <div
      class="flex aspect-square w-12 sm:w-full translate-y-0.5 items-center justify-center rounded-lg border text-foreground"
    >
      <img
        class="border-transparent rounded-sm"
        :src="imgSrc"
        :alt="imgAlt"
        :height="imgSize"
        :width="imgSize"
      />
    </div>

    <div class="grid gap-3">
      <div class="flex items-start justify-between gap-4">
        <div class="grid">
          <p class="font-medium text-foreground">{{ companyName }}</p>
          <p v-for="role in jobRoles" class="font-light text-muted-foreground">{{ role }}</p>
        </div>

        <p class="font-light text-muted-foreground">{{ actualDateRange }}</p>
      </div>

      <p class="text-muted-foreground font-light">{{ description }}</p>
    </div>
  </div>
</template>
