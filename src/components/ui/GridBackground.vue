<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import type { HTMLAttributes } from "vue";

export interface GridBackgroundProps extends /* @vue-ignore */ HTMLAttributes {
  gridSize?: number;
  gridColor?: string;
  darkGridColor?: string;
  showFade?: boolean;
  fadeIntensity?: number;
}

const props = withDefaults(defineProps<GridBackgroundProps>(), {
  gridSize: 20,
  gridColor: "#e4e4e7",
  darkGridColor: "262626",
  showFade: true,
  fadeIntensity: 20,
});

const currentGridColor = ref(props.gridColor);

const gridStyle = computed(() => ({
  backgroundSize: `${props.gridSize}px ${props.gridSize}px`,
  backgroundImage: `linear-gradient(to right, ${currentGridColor.value} 1px, transparent 1px),
                      linear-gradient(to bottom, ${currentGridColor.value} 1px, transparent 1px)`,
}));

const fadeStyle = computed(() => ({
  maskImage: `radial-gradient(ellipse at center, transparent ${props.fadeIntensity}%, black)`,
  WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${props.fadeIntensity}%, black)`,
}));

watchEffect((cleanup) => {
  const prefersDarkMode =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDarkModeActive = document.documentElement.classList.contains("dark") || prefersDarkMode;

  currentGridColor.value = isDarkModeActive ? props.darkGridColor : props.gridColor;

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "class") {
        const updatedIsDarkModeActive = document.documentElement.classList.contains("dark");
        currentGridColor.value = updatedIsDarkModeActive ? props.darkGridColor : props.gridColor;
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  cleanup(() => observer.disconnect());
});
</script>

<template>
  <div class="relative flex h-200 w-full items-center justify-center bg-transparent" v-bind="props">
    <div class="absolute inset-0" :style="gridStyle" />

    <div
      v-if="showFade"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black"
      :style="fadeStyle"
    />

    <div class="relative z-20">
      <slot />
    </div>
  </div>
</template>
