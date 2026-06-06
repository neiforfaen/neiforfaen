<script setup lang="ts">
const aboutTitle = "About";
const aboutTextOne =
  "I have a deep passion for building elegant, performant user experiences and specialize in modern frontend architecture. My focus is on creating intuitive user interfaces, with a particular interest in frontend developer tooling.";
const aboutTextTwo =
  "Outside of the visual layer, I'm interested in the systems and decisions underneath great products and spend my free time learning beyond pure frontend work.";
</script>

<template>
  <section className="grid gap-6">
    <h2 className="font-medium text-muted-foreground pb-6 border-b">{{ aboutTitle }}</h2>
    <p>{{ aboutTextOne }}</p>
    <p>{{ aboutTextTwo }}</p>
  </section>
</template>
