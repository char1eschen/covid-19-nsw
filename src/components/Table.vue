<template>
  <div class="">
    <v-client-table v-if="columns" :data="tableData" :columns="columns" :options="options">
      <a
        :href="props.row.source"
        target="_blank"
        slot="caseno"
        slot-scope="props"
      >
        {{ props.row.caseno }}
      </a>
    </v-client-table>
  </div>
</template>

<script>
export default {
  name: "Table",
  data() {
    return {
      options: {
        headings: {
          caseno: "Case No.",
          details: "Details",
          travelledoverseas: "Travelled Overseas",
          originate: "Originate",
          status: "Status",
          dateofdiagnosis: "Date of Diagnosis"
        },
        texts:{
          limit:"Cases pre page:",
          page:"Page:",
          filterBy:"Filter by {column}",
        },
        pagination: { 
          // dropdown: true,
        },
        // perPage: 25,
        // perPageValues: [25, 50, 100],
        filterByColumn: true,
        filterable: true,
        listColumns: {
          travelledoverseas: [
            { id: "Yes", text: "Yes" },
            { id: "No", text: "No" }
            // { id: "Unknow", text: "Unknown", hide: true }
          ],
          status: [
            { id: "Admission", text: "Admission" },
            { id: "Discharged", text: "Discharged" }
          ]
        },
        dateColumns: ["dateofdiagnosis"],
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
      default: () => {
        return null;
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
