<template>
  <div class="container-fluid panel">
    <PanelHeader panelTitle="Summary" />

    <div class="row">
      <div class="col-xs-12">
        <p class="intro">
          As on {{ updatedDate }}, we have {{ cases.total }} confirmed cases of
          coronavirus (COVID-19), including {{ cases.confirmed }} active cases
          and {{ cases.death }} deaths, in NSW.
        </p>
      </div>
    </div>

    <div class="panel">
      <div class="row">
        <div class="col-sm-6 mt-10">
          <div class="summaryPanel confirmed">
            <p class="increment" v-if="incrementCases.confirmed !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(incrementCases.confirmed) == '+'
                    ? 'increase'
                    : 'decrease'
                ]"
                >{{ prefix(incrementCases.confirmed)
                }}{{ incrementCases.confirmed }}</em
              >
            </p>
            <p class="increment" v-else>No-growth</p>
            <p class="number">{{ cases.confirmed }}</p>
            <p class="text">Active</p>
          </div>
        </div>
        <hr class="visible-xs" />
        <!-- <div class="col-sm-4 mt-10">
          <div class="summaryPanel recovered line">
            <p class="increment" v-if="incrementCases.recovered !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(incrementCases.recovered) == '+'
                    ? 'increase'
                    : 'decrease'
                ]"
                >{{ prefix(incrementCases.recovered)
                }}{{ incrementCases.recovered }}</em
              >
            </p>
            <p class="increment" v-else>No-growth</p>
            <p class="number">{{ cases.recovered }}</p>
            <p class="text">Recoveries</p>
          </div>
        </div> -->
        <!-- <hr class="visible-xs" /> -->
        <div class="col-sm-6 mt-10">
          <div class="summaryPanel death">
            <p class="increment" v-if="incrementCases.death !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(incrementCases.death) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(incrementCases.death)
                }}{{ incrementCases.death }}</em
              >
            </p>
            <p class="increment" v-else>No-growth</p>
            <p class="number">{{ cases.death }}</p>
            <p class="text">Deceased<sup>1</sup></p>
          </div>
        </div>
        <hr class="visible-xs" />
        <div class="col-sm-6 mt-10">
          <div class="summaryPanel total">
            <p class="increment" v-if="incrementCases.total !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(incrementCases.total) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(incrementCases.total)
                }}{{ incrementCases.total }}</em
              >
            </p>
            <p class="increment" v-else>No-growth</p>
            <p class="number">{{ cases.total }}</p>
            <p class="text">Total cases<sup>2</sup></p>
          </div>
        </div>
        <hr class="visible-xs" />
        <!-- <div class="col-sm-4 mt-10">
          <div class="summaryPanel investigated line">
            <p class="increment" v-if="investigatedIncrease !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(investigatedIncrease) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(investigatedIncrease)
                }}{{ investigatedIncrease }}</em
              >
            </p>
            <p class="increment" v-else>No-growth</p>
            <p class="number">{{ statistics[1].underinvestigation }}</p>
            <p class="text">Investigating</p>
          </div>
        </div> -->
        <!-- <hr class="visible-xs" /> -->
        <div class="col-sm-6 mt-10">
          <div class="summaryPanel excluded">
            <p class="increment" v-if="excludedIncrease !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(excludedIncrease) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(excludedIncrease) }}{{ excludedIncrease }}</em
              >
            </p>
            <p class="increment" v-else>No-growth</p>
            <p class="number">{{ statistics[1].testedandexcluded }}</p>
            <p class="text">Excluded</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-15">
      <small class="col-xs-12"
        >1. Includes a QLD resident who died in NSW.</small
      >
      <small class="col-xs-12"
        >2. Includes a Victorian resident hospitalised in NSW and a QLD resident
        (deceased).</small
      >
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
    updatedDate: {
      type: String,
      default: null
    },
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
<style scoped lang="stylus">
hr
  margin 0
small
  text-align left
.panel
  margin-bottom 15px
.intro
  text-align left
  margin-bottom 15px
.number
  font-weight 600
  font-size 4rem
.text
  font-weight 800
.increase
  color rgb(255, 99, 132)
.decrease
  color rgb(75, 192, 192)
.confirmed .number
  color rgb(255, 159, 64)
.recovered .number
  color rgb(75, 192, 192)
.death .number
  color rgb(153,153,153)
.total .number
  color rgb(255, 99, 132)
.investigated .number
  color rgb(255, 205, 86)
.excluded .number
  color rgb(54, 162, 235)

// @media (max-width: 767.98px)
  .summaryPanel
    display grid
  .increment
    grid-column 1 / 3
    grid-row 2 / 3
    text-align left
  .text
    grid-column 1 / 2
    text-align left
    align-self center
  .number
    grid-column 2 / 3
    grid-row 1 / 2
    font-size 3rem
    text-align right
    align-self center
</style>
