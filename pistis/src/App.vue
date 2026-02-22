<template>
  <v-app>
    <TheNav />
    <v-main>
      <router-view :key="$route.fullPath"/>
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script setup>
import TheNav from '@/components/TheNav.vue'
import TheFooter from './components/TheFooter.vue';
</script>

<style>

body {
  font-family: 'IBM Plex Sans', sans-serif;
}

.v-application {
  font-family: 'IBM Plex Sans', sans-serif;
}

@media (max-width: 600px) {
  :root {
    font-size: 1rem;
  }
}
</style>