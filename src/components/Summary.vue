<template>
  <div class="container-fluid panel">
    <PanelHeader panelTitle="Summary" />

    <div class="row">
      <div class="col-xs-12">
        <p class="intro">
          As on {{ updatedDate }}, we have {{ cases.total }} confirmed cases of
          coronavirus (COVID-19), including {{ cases.confirmed }} active cases,
          {{ cases.recovered }} recoveries and {{ cases.death }} deaths, in NSW.
        </p>
      </div>
    </div>

    <div class="panel">
      <div class="row">
        <div class="col-xs-4 mt-10">
          <div class="summaryPanel confirmed">
            <p v-if="incrementCases.confirmed !== 0">
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
            <p v-else>No increment</p>
            <p class="number">{{ cases.confirmed }}</p>
            <p class="text">Active</p>
          </div>
        </div>
        <div class="col-xs-4 mt-10">
          <div class="summaryPanel recovered line">
            <p v-if="incrementCases.recovered !== 0">
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
            <p v-else>No increment</p>
            <p class="number">{{ cases.recovered }}</p>
            <p class="text">Recoveries</p>
          </div>
        </div>
        <div class="col-xs-4 mt-10">
          <div class="summaryPanel death">
            <p v-if="incrementCases.death !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(incrementCases.death) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(incrementCases.death)
                }}{{ incrementCases.death }}</em
              >
            </p>
            <p v-else>No increment</p>
            <p class="number">{{ cases.death }}</p>
            <p class="text">Deaths</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-4 mt-10">
          <div class="summaryPanel total">
            <p v-if="incrementCases.total !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(incrementCases.total) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(incrementCases.total)
                }}{{ incrementCases.total }}</em
              >
            </p>
            <p v-else>No increment</p>
            <p class="number">{{ cases.total }}</p>
            <p class="text">Total confirmed</p>
          </div>
        </div>
        <div class="col-xs-4 mt-10">
          <div class="summaryPanel investigated line">
            <p v-if="investigatedIncrease !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(investigatedIncrease) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(investigatedIncrease)
                }}{{ investigatedIncrease }}</em
              >
            </p>
            <p v-else>No increment</p>
            <p class="number">{{ statistics[1].underinvestigation }}</p>
            <p class="text">Investigated</p>
          </div>
        </div>
        <div class="col-xs-4 mt-10">
          <div class="summaryPanel excluded">
            <p v-if="excludedIncrease !== 0">
              Compared to yesterday
              <em
                :class="[
                  prefix(excludedIncrease) == '+' ? 'increase' : 'decrease'
                ]"
                >{{ prefix(excludedIncrease) }}{{ excludedIncrease }}</em
              >
            </p>
            <p v-else>No increment</p>
            <p class="number">{{ statistics[1].testedandexcluded }}</p>
            <p class="text">Excluded</p>
          </div>
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
.intro
  text-align left
  margin-bottom 15px
.number
  font-weight 600
  font-size 4rem
.text
  font-weight 800
// .line:before
//   position: absolute;
//   bottom: .04rem;
//   left: -.005rem;
//   z-index: 2;
//   width: .01rem;
//   height: .4rem;
//   margin-top: -.15rem;
//   background-image: linear-gradient(180deg,#eee,#e1e1e1 51%,#fff);
//   content: "";
.increase
  color: rgb(255, 99, 132)
.decrease
  color: rgb(75, 192, 192)
.confirmed .number
  color: rgb(255, 159, 64)
.recovered .number
  color: rgb(75, 192, 192)
.death .number
  color: rgb(153,153,153)
.total .number
  color: rgb(255, 99, 132)
.investigated .number
  color: rgb(255, 205, 86)
.excluded .number
  color: rgb(54, 162, 235)
</style>
