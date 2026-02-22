<template>
  <div class="preview-sticky">
    <v-card class="pa-md-3 scrollable" elevation="3">
      <v-skeleton-loader class="ma-2" type="heading" />
      <v-divider />
      <v-card-text>
        <v-skeleton-loader class="ma-2" type="list-item-avatar-three-line" />
        <v-divider class="my-md-4" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}
.scrollable {
  overflow-y: auto;
  max-height: calc(85vh);
}
</style>
