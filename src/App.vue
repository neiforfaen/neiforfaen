<script setup lang="ts">
import { VueLenis } from "lenis/vue";
import type { LenisOptions } from "lenis";
import Footer from "@components/layout/Footer.vue";
import Header from "@components/layout/Header.vue";
import Root from "@components/layout/Root.vue";
import About from "@components/sections/About.vue";
import Work from "@components/sections/Work.vue";
import Projects from "@components/sections/Projects.vue";
import GridBackground from "@components/ui/GridBackground.vue";
import Certificates from "@components/sections/Certificates.vue";

const lenisOptions: LenisOptions = {
  autoRaf: true,
  autoResize: true,
};
</script>

<template>
  <VueLenis root :options="lenisOptions" />
  <GridBackground
    :gridSize="80"
    :fadeIntensity="5"
    class="h-fit animate-[fadeBlur_2s_ease-in-out_forwards]"
  >
    <Root>
      <Header />
      <About />
      <Work />
      <Projects />
      <Certificates />
      <Footer />
    </Root>
  </GridBackground>
</template>
