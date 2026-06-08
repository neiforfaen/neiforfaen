<script setup lang="ts">
const props = defineProps<{ status: "COMPLETED" | "IN_PROGRESS" }>();

const textMap: Record<typeof props.status, string> = {
  COMPLETED: "Certified",
  IN_PROGRESS: "In progress",
};

const defaultStyles =
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3! text-secondary-foreground [a]:hover:bg-secondary/80";

const background = props.status === "COMPLETED" ? "bg-secondary" : "bg-[#FFEE8C]";
</script>

<template>
  <span :class="`${defaultStyles} ${background}`">{{ textMap[props.status] }}</span>
</template>
