<template>
  <div class="container-fluid panel">
    <PanelHeader panelTitle="Novel coronavirus (COVID-19) statistics" />
    <div class="row">
      <div class="col-xs-12">
        <v-client-table :data="tableData" :columns="columns" :options="options">
          <a
            :href="props.row.source"
            target="_blank"
            slot="caseno"
            slot-scope="props"
            >{{ props.row.caseno }}</a
          >
        </v-client-table>
      </div>
    </div>
  </div>
</template>

<script>
import PanelHeader from "./PanelHeader.vue";

export default {
  name: "Table",
  data() {
    return {
      options: {
        headings: {
          caseno: "Case No.",
          details: "Details",
          gender: "Gender",
          travelledoverseas: "Travelled Overseas",
          origin: "Source",
          status: "Status",
          dateofdiagnosis: "Date of Diagnosis"
        },
        texts: {
          limit: "Cases pre page:",
          page: "Page:",
          filterBy: "Filter by {column}"
        },
        pagination: {
          // dropdown: true,
        },
        // perPage: 25,
        // perPageValues: [25, 50, 100],
        filterByColumn: true,
        filterable: true,
        listColumns: {
          gender: [
            { id: "Male", text: "Male" },
            { id: "Female", text: "Female" }
          ],
          travelledoverseas: [
            { id: "Yes", text: "Yes" },
            { id: "No", text: "No" }
            // { id: "Unknow", text: "Unknown", hide: true }
          ],
          status: [
            { id: "Confirmed", text: "Confirmed" },
            { id: "Recovered", text: "Recovered" },
            { id: "Death", text: "Death" }
          ]
        },
        dateColumns: ["dateofdiagnosis"],
        dateFormat: "DD/MM/YYYY",
        datepickerOptions: {
          // See http://www.daterangepicker.com/#options
          showDropdowns: true,
          autoUpdateInput: true
        }
      }
    };
  },
  props: {
    columns: {
      type: Array,
      default: null
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {},
  components: {
    PanelHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
