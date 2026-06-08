<script setup lang="ts">
import { certificates } from "@/data/certificates";
import CertificateSectionItem from "../ui/CertificateSectionItem.vue";

const certificatesTitle = "Certificates";
</script>

<template>
  <section className="grid gap-6">
    <h2 className="font-medium text-muted-foreground pb-6">{{ certificatesTitle }}</h2>
    <div class="grid gap-6 sm:gap-2">
      <CertificateSectionItem v-for="cert in certificates" :key="cert.name" v-bind="cert" />
    </div>
  </section>
</template>
