<script setup lang="ts">
import FluidBackground from './components/FluidBackground.vue';
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import PortraitSection from './components/PortraitSection.vue';
import SkillsSection from './components/SkillsSection.vue';
import ExperienceSection from './components/ExperienceSection.vue';
import EducationSection from './components/EducationSection.vue';
import LanguagesSection from './components/LanguagesSection.vue';
import InterestsStrip from './components/InterestsStrip.vue';
import ContactFooter from './components/ContactFooter.vue';
import { useLenis } from './composables/useLenis';

useLenis();
</script>

<template>
  <FluidBackground />
  <NavBar />
  <main>
    <HeroSection />
    <PortraitSection />
    <SkillsSection />
    <ExperienceSection />
    <EducationSection />
    <LanguagesSection />
    <InterestsStrip />
    <ContactFooter />
  </main>
</template>

<style scoped>
main {
  position: relative;
  z-index: 1;
}
</style>
