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
      <div class="col-xs-3">
        <div class="summaryPanel total">
          <p class="number">{{ cases.total }}</p>
          <p class="text">Confirmed</p>
        </div>
      </div>
      <div class="col-xs-3">
        <div class="summaryPanel confirmed">
          <p class="number">{{ cases.confirmed }}</p>
          <p class="text">Remains</p>
        </div>
      </div>
      <div class="col-xs-3">
        <div class="summaryPanel recovered">
          <p class="number">{{ cases.recovered }}</p>
          <p class="text">recoveries</p>
        </div>
      </div>
      <div class="col-xs-3">
        <div class="summaryPanel death">
          <p class="number">{{ cases.death }}</p>
          <p class="text">Deaths</p>
        </div>
      </div>
    </div>

    <div class="row">
      <table class="col-md-8 col-xs-12 col-md-offset-2">
        <thead>
          <tr class="tab-headings">
            <th class="col-xs-3 col-confirmed">Confirmed cases</th>
            <th class="col-xs-3 col-investigation">
              Cases under investigation
            </th>
            <th class="col-xs-3 col-excluded">Cases tested and excluded</th>
            <th class="col-xs-3 col-total">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.index">
            <td class="col-xs-3 col-confirmed">{{ item.confirmed }}</td>
            <td class="col-xs-3 col-investigation">
              {{ item.investigation }}
            </td>
            <td class="col-xs-3 col-excluded">{{ item.excluded }}</td>
            <td class="col-xs-3 col-total">{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import PanelHeader from "./PanelHeader.vue";
export default {
  name: "Summary",
  data() {
    return {
      items: [
        {
          confirmed: 65,
          investigation: 1004,
          excluded: 9152,
          total: 10221
        }
      ]
    };
  },
  props: {
    cases: {
      type: Object,
      default: null
    }
  },
  methods: {},
  components: {
    PanelHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
