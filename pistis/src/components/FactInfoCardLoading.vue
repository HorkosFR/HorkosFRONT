<template>
  <div class="preview-sticky">
    <v-card class="pa-3" elevation="3">
      <v-skeleton-loader class="ma-2" type="heading" />

      <v-skeleton-loader class="ma-2" type="chip" />

      <v-divider class="mb-2 mt-2" />

      <v-card-text>
        <div>
          <v-row>
            <v-col cols="7" md="8" sm="4">
              <v-skeleton-loader class="ma-2" type="text@3" />
            </v-col>
            <v-col class="text-right text-disabled" cols="5" md="4" sm="4">
              <v-skeleton-loader class="ma-2" type="text" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-skeleton-loader class="ma-2" type="text@3" />
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12" md="12">
            <v-skeleton-loader class="ma-2" type="heading, subtitle, paragraph" />
          </v-col>
        </v-row>
        <div>
          <v-divider class="my-4" />
          <v-row class="align-center d-flex justify-space-between mb-2">
            <v-col cols="9" md="6">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">
                <v-skeleton-loader class="ma-2" type="heading" />
              </h3>
            </v-col>
          </v-row>

          <v-list density="comfortable">
            <v-skeleton-loader class="ma-2" type="list-item-two-line" />
          </v-list>

          <v-divider class="my-4" />
          <v-row class="align-center d-flex justify-space-between mb-2">
            <v-col cols="9" md="6">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">
                <v-skeleton-loader class="ma-2" type="heading" />
              </h3>
            </v-col>
          </v-row>
          <v-list density="comfortable">
            <v-skeleton-loader class="ma-2" type="list-item-avatar-two-line" />
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}

.markdown-body {
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface));
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-body a {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.markdown-body.good h1,
.markdown-body.good h2,
.markdown-body.good h3 {
  color: rgb(var(--v-theme-primary));
}

.markdown-body.bad h1,
.markdown-body.bad h2,
.markdown-body.bad h3 {
  color: rgb(var(--v-theme-error));
}

.markdown-body code {
  background-color: #F3F4F6;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: monospace;
}

.markdown-body blockquote {
  border-left: 4px solid #e0e0e0;
  /* Gris clair */
  padding-left: 16px;
  margin: 16px 0;
  color: #616161;
  font-style: italic;
  /* Optionnel : pour que ça ressemble à une citation moderne */
  background-color: #f5f5f5;
  padding-top: 8px;
  padding-bottom: 8px;
}

.markdown-body pre {
  background-color: #F3F4F6;
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-body ul {
  margin-left: 20px;
  list-style-type: disc;
}

.fact-label {
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.fact-text {
  font-size: 1rem;
  line-height: 1.8;
}

.info-label {
  display: flex;
  align-items: center;
}

.filter-card {
  transition: all 0.2s ease;
}

.info-value {
  margin-left: 26px;
  /* pour aligner le texte de la valeur sous le label sans l’icône */
}

.row-outline {
  border: 1px solid;
  border-radius: 8px;
  padding: 12px;
}

.good-border {
  border-color: rgb(var(--v-theme-primary));
}

.bad-border {
  border-color: rgb(var(--v-theme-error));
}

.entity-view {
  overflow: hidden;
}

.scrollable {
  overflow-y: auto;
  max-height: 100%;
}

.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}

.filter-card {
  transition: all 0.2s ease;
}

.filter-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.fact-label {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-left: 4px solid;
  padding-left: 8px;
  margin-bottom: 4px;
}

.fact-text {
  line-height: 1.5;
}

/* Card container: empêche le débordement en largeur */
.fact-card {
  width: 100%;
  overflow: hidden;
  /* empêche tout enfant de "sortir" visuellement */
  box-sizing: border-box;
}

/* racine du titre : s'assure que la ligne prend toute la largeur */
.title-root {
  font-size: 20px;
  width: 100%;
  gap: 8px;
  padding-right: 8px;
  /* espace pour ne pas coller au bord */
}

@media (max-width: 600px) {
  .title-root {
    font-size: 16px;
    width: 100%;
    gap: 8px;
    padding-right: 8px;
    /* espace pour ne pas coller au bord */
  }
}

/* conteneur gauche : prend l'espace disponible, mais peut se réduire */
.title-left {
  min-width: 0;
  /* CRUCIAL pour que l'ellipsis fonctionne dans un flex */
  gap: 8px;
  align-items: center;
}

/* texte tronqué : flex-1 + min-width:0 pour fonctionner dans flex */
.title-text {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  /* CRUCIAL */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

/* report bouton collé au texte sans forcer largeur */
.report-btn {
  flex: 0 0 auto;
  margin-left: 8px;
  position: relative;
  top: -3px;
}

/* bloc droit pour les boutons : ne grossit pas */
.title-actions {
  flex: 1 1 auto;
  justify-content: right;
  gap: 8px;
  align-items: center;
}

/* bouton d'action safe : empêche Vuetify d'imposer un min-width trop grand */
.action-btn {
  flex: 0 0 auto;
  min-width: auto !important;
}

/* préserve le design hover que tu as déjà */
.hover-elevate {
  transition: all 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
