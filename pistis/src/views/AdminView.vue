<template>
  <v-container class="pa-4" fluid>
    <v-row align="start" justify="space-between" no-gutters>
      <v-col cols="12" md="8">

        <v-card class="ma-md-4" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">Signalement</v-card-title>
          <v-divider />
          <v-col
            v-for="report in reports"
            :key="report.id"
            cols="12"
            lg="4"
            md="6"
          >
            <v-card elevation="3">
              <v-card-title class="d-flex align-center justify-space-between">
                <div>
                  <v-btn
                    color="primary"
                    :href="`/${report.targetType}/${report.targetId}`"
                    icon="mdi-open-in-new"
                    size="small"
                    target="_blank"
                    variant="plain"
                  />
                  <span class="text-subtitle-1 font-weight-medium">
                    {{ report.targetType || 'Cible inconnue' }}
                  </span>
                </div>
                <v-chip color="primary" size="small" variant="tonal">
                  {{ report.reason }}
                </v-chip>
              </v-card-title>

              <v-card-text class="text-body-2 space-y-2">
                <div>
                  <strong>ID cible :</strong>
                  <span class="text-mono">{{ report.targetId ?? '—' }}</span>
                </div>

                <div v-if="report.comment">
                  <strong>Commentaire :</strong>
                  <p class="mt-1 text-grey-darken-2">{{ report.comment }}</p>
                </div>
              </v-card-text>

              <v-divider />

              <v-card-actions class="justify-end">
                <v-btn color="error" size="small" variant="text" @click="openDialog(report)">
                  Traiter le report
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col v-if="reports.length === 0" cols="12">
            <v-alert type="info" variant="tonal">
              Aucun signalement pour le moment.
            </v-alert>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="reportDialog" max-width="800px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1">Informations de clôture</v-card-title>

      <v-textarea
        v-if="updateReport"
        v-model="updateReport.adminComment"
        auto-grow
        color="primary"
        density="comfortable"
        label="Commentaire Administrateur"
        required
        rows="2"
        variant="outlined"
      />
      <v-card-actions class="justify-space-between">
        <v-btn color="secondary" variant="text" @click="cancel">Annuler</v-btn>
        <v-btn color="primary" variant="flat" @click="refuse">Refuser le signalement</v-btn>
        <v-btn color="error" variant="flat" @click="confirm">Supprimer l'item</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { Report } from '@/types/report.type'
  import { onMounted, ref } from 'vue'
  import reportService from '@/services/report.service'

  const reports = ref<Report[]>([])
  const reportDialog = ref<boolean>(false)
  const updateReport = ref<Report>()

  onMounted(loadReports)

  async function loadReports () {
    reports.value = await reportService.getReports()
  }

  function handleResolve (report: Report) {
    reports.value = reports.value.filter(r => r.id !== report.id)
  }

  function handleDelete (report: Report) {
    reports.value = reports.value.filter(r => r.id !== report.id)
  }

  function openDialog (report: Report) {
    updateReport.value = report
    reportDialog.value = true
  }

  async function confirm () {
    if (!updateReport.value) return
    if (!updateReport.value.adminComment) {
      alert('Commentaire obligatoire')
      return
    }
    updateReport.value.status = 'Accepted'
    await reportService.banReportItem(updateReport.value.id)
    await reportService.updateReport(updateReport.value.id, updateReport.value)
    reports.value = reports.value.filter(r => r.id !== updateReport.value.id)
    reportDialog.value = false
  }

  function cancel () {
    reportDialog.value = false
  }

  async function refuse () {
    if (!updateReport.value) return
    if (!updateReport.value.adminComment) {
      alert('Commentaire obligatoire')
      return
    }
    updateReport.value.status = 'Refused'
    await reportService.updateReport(updateReport.value.id, updateReport.value)
    reports.value = reports.value.filter(r => r.id !== updateReport.value.id)
    reportDialog.value = false
  }
</script>

<style scoped>
.space-y-2>*+* {
  margin-top: 0.5rem;
}
</style>
