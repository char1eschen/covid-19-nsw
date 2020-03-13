<template>
  <div>
    <PanelHeader panelTitle="Summary" />

    <div class="row">
      <div class="col-xs-12">
        <p>
          As at 11:00 hrs on 11 March 2020, we have {{ cases.total }} confirmed
          cases of coronavirus (COVID-19), including
          {{ cases.confirmed }} remains, {{ cases.recovered }} recoveries and
          {{ cases.death }} deaths, in NSW.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-4">
        <div class="summaryPanel confirmed">
          <p v-if="incrementCases.confirmed !== 0">
            Compared to yesterday
            <em
              >{{ prefix(incrementCases.confirmed)
              }}{{ incrementCases.confirmed }}</em
            >
          </p>
          <p v-else>No increment</p>
          <p class="number">{{ cases.confirmed }}</p>
          <p class="text">Existing confirmed</p>
        </div>
      </div>
      <div class="col-xs-4">
        <div class="summaryPanel recovered">
          <p v-if="incrementCases.recovered !== 0">
            Compared to yesterday
            <em
              >{{ prefix(incrementCases.recovered)
              }}{{ incrementCases.recovered }}</em
            >
          </p>
          <p v-else>No increment</p>
          <p class="number">{{ cases.recovered }}</p>
          <p class="text">Recoveries</p>
        </div>
      </div>
      <div class="col-xs-4">
        <div class="summaryPanel death">
          <p v-if="incrementCases.death !== 0">
            Compared to yesterday
            <em
              >{{ prefix(incrementCases.death) }}{{ incrementCases.death }}</em
            >
          </p>
          <p v-else>No increment</p>
          <p class="number">{{ cases.death }}</p>
          <p class="text">Deaths</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-4">
        <div class="summaryPanel total">
          <p v-if="incrementCases.total !== 0">
            Compared to yesterday
            <em
              >{{ prefix(incrementCases.total) }}{{ incrementCases.total }}</em
            >
          </p>
          <p v-else>No increment</p>
          <p class="number">{{ cases.total }}</p>
          <p class="text">Total confirmed</p>
        </div>
      </div>
      <div class="col-xs-4">
        <div class="summaryPanel confirmed">
          <p v-if="investigatedIncrease !== 0">
            Compared to yesterday
            <em
              >{{ prefix(investigatedIncrease) }}{{ investigatedIncrease }}</em
            >
          </p>
          <p v-else>No increment</p>
          <p class="number">{{ statistics[1].underinvestigation }}</p>
          <p class="text">Investigated</p>
        </div>
      </div>
      <div class="col-xs-4">
        <div class="summaryPanel recovered">
          <p v-if="excludedIncrease !== 0">
            Compared to yesterday
            <em>{{ prefix(excludedIncrease) }}{{ excludedIncrease }}</em>
          </p>
          <p v-else>No increment</p>
          <p class="number">{{ statistics[1].testedandexcluded }}</p>
          <p class="text">Excluded</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PanelHeader from "./PanelHeader.vue";
export default {
  name: "Summary",
  computed: {
    investigatedIncrease() {
      return (
        this.statistics[1].underinvestigation -
        this.statistics[0].underinvestigation
      );
    },
    excludedIncrease() {
      return (
        this.statistics[1].testedandexcluded -
        this.statistics[0].testedandexcluded
      );
    }
  },
  props: {
    cases: {
      type: Object,
      default: null
    },
    incrementCases: {
      type: Object,
      default: null
    },
    statistics: {
      type: Array,
      default: null
    }
  },
  methods: {
    prefix(val) {
      if (val !== 0) {
        if (val > 0) {
          return "+";
        } else {
          return "-";
        }
      }
    }
  },
  components: {
    PanelHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
