<script setup lang="ts">
import Footer from "@components/layout/Footer.vue";
import Header from "@components/layout/Header.vue";
import Root from "@components/layout/Root.vue";
import About from "@components/sections/About.vue";
import Work from "@components/sections/Work.vue";
import Projects from "./components/sections/Projects.vue";
</script>

<template>
  <Root>
    <Header />
    <About />
    <Work />
    <Projects />
    <Footer />
  </Root>
</template>
