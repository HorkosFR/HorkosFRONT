<template>
  <v-container class="py-8" fluid>
    <v-row no-gutters>
      <v-navigation-drawer elevation="2" expand-on-hover permanent :rail="!mdAndUp">
        <v-list density="comfortable" nav>
          <v-list-item
            v-for="tab in tabs"
            :key="tab.value"
            :active="activeTab === tab.value"
            color="primary"
            :prepend-icon="tab.icon"
            :title="tab.label"
            @click="activeTab = tab.value"
          />
        </v-list>
      </v-navigation-drawer>

      <v-col>
        <v-window v-model="activeTab">
          <v-window-item value="presentation">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <div class="d-flex align-center justify-center">
                  <v-img class="ml-2" cover max-width="300" src="/HorkosFullLogo.PNG" />
                </div>
                <v-divider class="mb-4" />

                <h3 class="text-h6 font-weight-medium mb-3" v-html="t('horkosview.presentation.titleWho')" />
                <p v-html="t('horkosview.presentation.p1')" />
                <p v-html="t('horkosview.presentation.p2')" />

                <v-divider class="my-6" />

                <h3 class="text-h6 font-weight-medium mb-3" v-html="t('horkosview.presentation.titleCommunity')" />
                <p v-html="t('horkosview.presentation.p3')" />
                <p v-html="t('horkosview.presentation.p4')" />

                <v-alert class="my-4" color="primary" variant="tonal">
                  <div v-html="t('horkosview.presentation.alertCollective')" />
                </v-alert>

                <v-divider class="my-6" />

                <h3
                  class="text-h6 font-weight-medium mb-3"
                  v-html="t('horkosview.presentation.titleReliabilityNote')"
                />
                <p v-html="t('horkosview.presentation.p5')" />

                <ul class="ml-6">
                  <li v-html="t('horkosview.presentation.listReliability.sources')" />
                  <li v-html="t('horkosview.presentation.listReliability.contradictions')" />
                  <li v-html="t('horkosview.presentation.listReliability.crossChecks')" />
                </ul>

                <p class="mt-3" v-html="t('horkosview.presentation.p6')" />

                <v-alert class="my-4" color="secondary" variant="tonal">
                  <div v-html="t('horkosview.presentation.alertMirror')" />
                </v-alert>

                <v-divider class="my-6" />

                <h3 class="text-h6 font-weight-medium mb-3" v-html="t('horkosview.presentation.titleCitizenInfo')" />
                <p v-html="t('horkosview.presentation.p7')" />

                <p v-html="t('horkosview.presentation.p8')" />

                <v-divider class="my-6" />

                <h3 class="text-h6 font-weight-medium mb-3" v-html="t('horkosview.presentation.titleVision')" />
                <p v-html="t('horkosview.presentation.p9')" />
              </v-card-text>
            </v-card>

          </v-window-item>

          <v-window-item value="cgu">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.cgu.title')" />
                <p v-html="t('horkosview.cgu.body')" />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="createFact">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.createFact.title')" />
                <p v-html="t('horkosview.createFact.body')" />
                <v-divider mx="2" />
                <h3 class="font-weight-medium mb-3" v-html="t('horkosview.createFact.factType.title')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.statement.title')" />
                <p v-html="t('horkosview.createFact.factType.statement.description')" />
                <em v-html="t('horkosview.createFact.factType.statement.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.flipflop.title')" />
                <p v-html="t('horkosview.createFact.factType.flipflop.description')" />
                <em v-html="t('horkosview.createFact.factType.flipflop.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.descision.title')" />
                <p v-html="t('horkosview.createFact.factType.descision.description')" />
                <em v-html="t('horkosview.createFact.factType.descision.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.case.title')" />
                <p v-html="t('horkosview.createFact.factType.case.description')" />
                <em v-html="t('horkosview.createFact.factType.case.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.relationship.title')" />
                <p v-html="t('horkosview.createFact.factType.relationship.description')" />
                <em v-html="t('horkosview.createFact.factType.relationship.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.behavior.title')" />
                <p v-html="t('horkosview.createFact.factType.behavior.description')" />
                <em v-html="t('horkosview.createFact.factType.behavior.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.career.title')" />
                <p v-html="t('horkosview.createFact.factType.career.description')" />
                <em v-html="t('horkosview.createFact.factType.career.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.success.title')" />
                <p v-html="t('horkosview.createFact.factType.success.description')" />
                <em v-html="t('horkosview.createFact.factType.success.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.failure.title')" />
                <p v-html="t('horkosview.createFact.factType.failure.description')" />
                <em v-html="t('horkosview.createFact.factType.failure.example')" />
                <h4 class="mb-n3" v-html="t('horkosview.createFact.factType.factMisc.title')" />
                <p v-html="t('horkosview.createFact.factType.factMisc.description')" />
                <em v-html="t('horkosview.createFact.factType.factMisc.example')" />

              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="contributionPractice">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.contributionPractice.title')" />
                <p v-html="t('horkosview.contributionPractice.body')" />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="tags">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">

                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.tags.title')" />

                <p v-html="t('horkosview.tags.intro1')" />

                <p v-html="t('horkosview.tags.intro2')" />

                <v-divider class="my-4" />

                <h4 class="mb-2" v-html="t('horkosview.tags.categories.identity.title')" />
                <p v-html="t('horkosview.tags.categories.identity.p')" />

                <ul class="ml-4">
                  <li v-html="t('horkosview.tags.categories.identity.items.publicIdentity')" />
                  <li v-html="t('horkosview.tags.categories.identity.items.career')" />
                  <li v-html="t('horkosview.tags.categories.identity.items.legalHistory')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="mb-2" v-html="t('horkosview.tags.categories.integrity.title')" />
                <p v-html="t('horkosview.tags.categories.integrity.p')" />

                <ul class="ml-4">
                  <li v-html="t('horkosview.tags.categories.integrity.items.belongings')" />
                  <li v-html="t('horkosview.tags.categories.integrity.items.scandals')" />
                  <li v-html="t('horkosview.tags.categories.integrity.items.rules')" />
                  <li v-html="t('horkosview.tags.categories.integrity.items.conflicts')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="mb-2" v-html="t('horkosview.tags.categories.coherence.title')" />
                <p v-html="t('horkosview.tags.categories.coherence.p')" />

                <ul class="ml-4">
                  <li v-html="t('horkosview.tags.categories.coherence.items.promises')" />
                  <li v-html="t('horkosview.tags.categories.coherence.items.stability')" />
                  <li v-html="t('horkosview.tags.categories.coherence.items.align')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="mb-2" v-html="t('horkosview.tags.categories.competence.title')" />
                <p v-html="t('horkosview.tags.categories.competence.p')" />

                <ul class="ml-4">
                  <li v-html="t('horkosview.tags.categories.competence.items.results')" />
                  <li v-html="t('horkosview.tags.categories.competence.items.communication')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="mb-2" v-html="t('horkosview.tags.categories.relations.title')" />
                <p v-html="t('horkosview.tags.categories.relations.p')" />

                <ul class="ml-4">
                  <li v-html="t('horkosview.tags.categories.relations.items.partnership')" />
                  <li v-html="t('horkosview.tags.categories.relations.items.independency')" />
                  <li v-html="t('horkosview.tags.categories.relations.items.network')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="mb-2" v-html="t('horkosview.tags.categories.behavior.title')" />
                <p v-html="t('horkosview.tags.categories.behavior.p')" />

                <ul class="ml-4">
                  <li v-html="t('horkosview.tags.categories.behavior.items.attitude')" />
                  <li v-html="t('horkosview.tags.categories.behavior.items.ethical')" />
                  <li v-html="t('horkosview.tags.categories.behavior.items.management')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="mb-2" v-html="t('horkosview.tags.summaryTitle')" />
                <pre class="pa-3 rounded bg-grey-lighten-4 text-caption" v-html="t('horkosview.tags.summary')" />
                <p v-html="t('horkosview.tags.finalNote')" />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="reliability">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.reliability.title')" />

                <p v-html="t('horkosview.reliability.intro')" />

                <v-divider class="my-4" />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section1.title')" />
                <p v-html="t('horkosview.reliability.section1.description')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.reliability.section1.list1')" />
                  <li v-html="t('horkosview.reliability.section1.list2')" />
                  <li v-html="t('horkosview.reliability.section1.list3')" />
                  <li v-html="t('horkosview.reliability.section1.list4')" />
                  <li v-html="t('horkosview.reliability.section1.list5')" />
                  <li v-html="t('horkosview.reliability.section1.list6')" />
                </ul>

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section2.title')" />
                <p v-html="t('horkosview.reliability.section2.description')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section2.timeWeight')"
                />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section3.title')" />
                <p v-html="t('horkosview.reliability.section3.description')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.reliability.section3.gravity')" />
                  <li v-html="t('horkosview.reliability.section3.reliability')" />
                </ul>
                <p v-html="t('horkosview.reliability.section3.choice')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section3.calculation')"
                />
                <p v-html="t('horkosview.reliability.section3.idea')" />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section4.title')" />
                <p v-html="t('horkosview.reliability.section4.forEachFact')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section4.calculation')"
                />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section5.title')" />
                <p v-html="t('horkosview.reliability.section5.description')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section5.calculation')"
                />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section6.title')" />
                <p v-html="t('horkosview.reliability.section6.description')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section6.calculation')"
                />
                <p v-html="t('horkosview.reliability.section6.normalizedImpact')" />

                <v-divider class="my-4" />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section7.title')" />
                <p v-html="t('horkosview.reliability.section7.description')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section7.calculation')"
                />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section8.title')" />
                <p v-html="t('horkosview.reliability.section8.description')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section8.calculation')"
                />

                <v-divider class="my-4" />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section9.title')" />
                <p v-html="t('horkosview.reliability.section9.description')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.reliability.section9.listitem1')" />
                  <li v-html="t('horkosview.reliability.section9.listitem2')" />
                  <li v-html="t('horkosview.reliability.section9.listitem3')" />
                  <li v-html="t('horkosview.reliability.section9.listitem4')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section10.title')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.reliability.section10.listitem1')" />
                  <li v-html="t('horkosview.reliability.section10.listitem2')" />
                  <li v-html="t('horkosview.reliability.section10.listitem3')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="text-subtitle-1 mb-2" v-html="t('horkosview.reliability.section11.title')" />
                <p class="text-caption" v-html="t('horkosview.reliability.section11.suppose')" />
                <pre
                  class="pa-3 rounded bg-grey-lighten-4 text-caption"
                  v-html="t('horkosview.reliability.section11.calculation')"
                />

                <p class="text-caption" v-html="t('horkosview.reliability.section11.example')" />
              </v-card-text>
            </v-card>

          </v-window-item>

          <v-window-item value="legal">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.legal.title')" />

                <p v-html="t('horkosview.legal.description')" />

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.legal.responsibilityTitle')" />
                <p v-html="t('horkosview.legal.responsibilityDescription')" />
                <p v-html="t('horkosview.legal.responsibilityLaw')" />

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.legal.reportTitle')" />
                <p v-html="t('horkosview.legal.reportDescription')" />

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.legal.rgpdTitle')" />
                <p v-html="t('horkosview.legal.rgpdDescription')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.legal.rgpdList1')" />
                  <li v-html="t('horkosview.legal.rgpdList2')" />
                  <li v-html="t('horkosview.legal.rgpdList3')" />
                </ul>

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.legal.moderationTitle')" />
                <p v-html="t('horkosview.legal.moderationDescription')" />

                <v-divider class="my-4" />

                <p class="text-caption text-grey-darken-1 text-center mt-4" v-html="t('horkosview.legal.footer')" />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="transparency">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.transparency.title')" />

                <p v-html="t('horkosview.transparency.intro')" />

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.transparency.hostingTitle')" />
                <p v-html="t('horkosview.transparency.hostingText1')" />
                <p v-html="t('horkosview.transparency.hostingText2')" />

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.transparency.toolsTitle')" />
                <p v-html="t('horkosview.transparency.toolsDescription')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.transparency.toolsList1')" />
                  <li v-html="t('horkosview.transparency.toolsList2')" />
                  <li v-html="t('horkosview.transparency.toolsList3')" />
                  <li v-html="t('horkosview.transparency.toolsList4')" />
                  <li v-html="t('horkosview.transparency.toolsList5')" />
                </ul>

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.transparency.administrationTitle')" />
                <p v-html="t('horkosview.transparency.administrationText1')" />
                <p v-html="t('horkosview.transparency.administrationText2')" />

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.transparency.insuranceTitle')" />
                <p v-html="t('horkosview.transparency.insuranceText1')" />
                <p v-html="t('horkosview.transparency.insuranceText2')" />

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.transparency.developmentTitle')" />
                <p v-html="t('horkosview.transparency.developmentDescription')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.transparency.developmentList1')" />
                  <li v-html="t('horkosview.transparency.developmentList2')" />
                  <li v-html="t('horkosview.transparency.developmentList3')" />
                </ul>

                <v-divider class="my-4" />

                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.transparency.independencyTitle')" />
                <p v-html="t('horkosview.transparency.independencyText1')" />
                <p v-html="t('horkosview.transparency.independencyText2')" />

                <v-divider class="my-4" />

                <p
                  class="text-caption text-grey-darken-1 text-center mt-4"
                  v-html="t('horkosview.transparency.footer')"
                />
              </v-card-text>
            </v-card>

          </v-window-item>

          <v-window-item value="privacy">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">
                <h2 class="font-weight-medium mb-3">{{ $t('horkosview.privacy.title') }}</h2>
                <p class="mb-6">{{ $t('horkosview.privacy.intro') }}</p>

                <v-divider class="my-4" />
                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.privacy.collection.title')" />
                <p v-html="t('horkosview.privacy.collection.content')" />
                <v-divider class="my-4" />
                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.privacy.usage.title')" />
                <p v-html="t('horkosview.privacy.usage.content')" />
                <v-divider class="my-4" />
                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.privacy.storage.title')" />
                <p v-html="t('horkosview.privacy.storage.content')" />
                <v-divider class="my-4" />
                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.privacy.rights.title')" />
                <p v-html="t('horkosview.privacy.rights.content')" />
                <v-divider class="my-4" />
                <h3 class="font-weight-medium mb-2" v-html="t('horkosview.privacy.contact.title')" />
                <p v-html="t('horkosview.privacy.contact.content')" />

              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="technical">
            <v-card class="pa-md-6 pa-2 ma-md-4" elevation="3">
              <v-card-text class="text-body-1 space-y-4">

                <h2 class="font-weight-medium mb-3" v-html="t('horkosview.technical.title')" />

                <p v-html="t('horkosview.technical.description')" />

                <v-divider class="my-4" />

                <h4 class="font-weight-medium mb-2" v-html="t('horkosview.technical.architecture.title')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.technical.architecture.list1')" />
                  <li v-html="t('horkosview.technical.architecture.list2')" />
                  <li v-html="t('horkosview.technical.architecture.list3')" />
                  <li v-html="t('horkosview.technical.architecture.list4')" />
                  <li v-html="t('horkosview.technical.architecture.list5')" />
                  <li v-html="t('horkosview.technical.architecture.list6')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="font-weight-medium mb-2" v-html="t('horkosview.technical.security.title')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.technical.security.list1')" />
                  <li v-html="t('horkosview.technical.security.list2')" />
                  <li v-html="t('horkosview.technical.security.list3')" />
                  <li v-html="t('horkosview.technical.security.list4')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="font-weight-medium mb-2" v-html="t('horkosview.technical.data.title')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.technical.data.list1')" />
                  <li v-html="t('horkosview.technical.data.list2')" />
                  <li v-html="t('horkosview.technical.data.list3')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="font-weight-medium mb-2" v-html="t('horkosview.technical.performance.title')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.technical.performance.list1')" />
                  <li v-html="t('horkosview.technical.performance.list2')" />
                  <li v-html="t('horkosview.technical.performance.list3')" />
                </ul>

                <v-divider class="my-4" />

                <h4 class="font-weight-medium mb-2" v-html="t('horkosview.technical.development.title')" />
                <ul class="ml-4">
                  <li v-html="t('horkosview.technical.development.list1')" />
                  <li v-html="t('horkosview.technical.development.list2')" />
                  <li v-html="t('horkosview.technical.development.list3')" />
                  <li v-html="t('horkosview.technical.development.list4')" />
                  <li v-html="t('horkosview.technical.development.list5')" />
                </ul>

                <v-divider class="my-4" />

                <p class="text-caption text-grey-darken-1 text-center mt-4" v-html="t('horkosview.technical.footer')" />

              </v-card-text>
            </v-card>
          </v-window-item>

        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'

  const { t } = useI18n()
  const { mdAndUp } = useDisplay()
  const route = useRoute()
  const activeTab = ref(route.query.tab?.toString() || 'presentation')

  const tabs = computed(() => [
    { label: t('horkosview.tabs.presentation'), value: 'presentation', icon: 'mdi-information-outline' },
    { label: t('horkosview.tabs.cgu'), value: 'cgu', icon: 'mdi-handshake-outline' },
    { label: t('horkosview.tabs.createFact'), value: 'createFact', icon: 'mdi-clipboard-check-outline' },
    { label: t('horkosview.tabs.contributionPractice'), value: 'contributionPractice', icon: 'mdi-school-outline' },
    { label: t('horkosview.tabs.tags'), value: 'tags', icon: 'mdi-tag-multiple-outline' },
    // { label: t('horkosview.tabs.reliability'), value: 'reliability', icon: 'mdi-calculator-variant-outline' },
    { label: t('horkosview.tabs.legal'), value: 'legal', icon: 'mdi-scale-balance' },
    { label: t('horkosview.tabs.privacy'), value: 'privacy', icon: 'mdi-shield-account-outline' },
  // { label: t('horkosview.tabs.transparency'), value: 'transparency', icon: 'mdi-cash-multiple' },
  // { label: t('horkosview.tabs.technical'), value: 'technical', icon: 'mdi-cog-outline' },
  ])

  useHead({
    title: computed(() => {
      const currentTab = tabs.value.find(tab => tab.value === activeTab.value)
      return `Horkos | ${currentTab ? currentTab.label : 'Infos'}`
    }),
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'Horkos',
          'url': 'https://horkos.fr',
        }),
      },
    ],
    meta: [
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Horkos' },
      {
        property: 'og:title',
        content: computed(() => {
          if (activeTab.value === 'tags') return 'Comprendre les scores de fiabilité | Horkos'
          if (activeTab.value === 'createFact') return 'Comment contribuer à Horkos ?'
          return 'À propos de Horkos | Transparence Politique'
        }),
      },
      {
        property: 'og:description',
        content: 'Découvrez la méthodologie, les règles de contribution et la vision citoyenne derrière le projet Horkos.',
      },
      {
        property: 'og:image',
        content: 'https://horkos.fr/HorkosFullLogo.PNG',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://horkos.fr/horkosview',
      },
    ],
  })
</script>

<style scoped>
.space-y-4>*+* {
  margin-top: 1rem;
}

pre {
  overflow-x: auto;
}
</style>
