<template>
  <div id="app">
    <Loading
      :active.sync="isLoading"
      :can-cancel="true"
      :loader="loader"
      :is-full-page="fullPage"
    />
    <Header v-if="!isLoading" :updatedDate="updatedDate" />
    <Summary v-if="!isLoading" :cases="cases" />
    <LineChart
      v-if="!isLoading"
      :chartdata="chartData"
      :options="chartOptions"
    />
    <Table v-if="!isLoading" :columns="columns" :tableData="tableData" />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Loading from "vue-loading-overlay";
import Header from "./components/Header.vue";
import Summary from "./components/Summary.vue";
import LineChart from "./components/charts/LineChart";
import Table from "./components/Table.vue";
import "vue-loading-overlay/dist/vue-loading.css";

const token = "1SCaQqie7igxhaj6fK22oJmkz3xJlw_Snfp3jFqE2JhQ";
export default {
  name: "App",
  data() {
    return {
      isLoading: true,
      loader: "dots",
      fullPage: true,
      columns: null,
      tableData: [],
      updatedDate: "",
      cases: null,
      labels: [],
      dailyCases: [],
      totalCases: [],
      chartData: null,
      chartOptions: {
        responsive: true,
        title: {
          display: true,
          text: "Total confirmed cases and daily new cases"
        },
        tooltips: {
          mode: "index",
          intersect: true
        }
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${token}/od6/public/values?alt=json`
        )
        .then(response => {
          // handle success
          this.isLoading = false;
          let columns = [];
          let entryData = response.data.feed.entry;
          let updated = response.data.feed.updated["$t"];
          // set table data
          entryData.forEach(item => {
            let itemObj = {};
            Object.keys(item).forEach(key => {
              if (key.includes("gsx$")) {
                if (key.substring(4) === "dateofdiagnosis") {
                  itemObj[key.substring(4)] = moment(
                    item[key]["$t"],
                    "DD/MM/YYYY"
                  );
                } else {
                  itemObj[key.substring(4)] = item[key]["$t"];
                }
              }
            });
            this.tableData.push(itemObj);
          });
          this.updatedDate = moment(updated).format("Do MMM YYYY, hh:mm:ss");

          // set table columns
          if (this.tableData[0]) {
            Object.keys(this.tableData[0]).forEach(key => {
              if (key !== "source") {
                columns.push(key);
              }
            });
          }
          this.columns = columns;

          // set summary data
          let cases = {
            total: this.tableData.length,
            confirmed: 0,
            recovered: 0,
            death: 0
          };
          this.tableData.map(item => {
            switch (item.status) {
              case "Confirmed":
                cases.confirmed++;
                break;
              case "Recovered":
                cases.recovered++;
                break;
              case "Death":
                cases.death++;
                break;
            }
          });
          this.cases = cases;

          // filter chart data
          let filteredData = this.chartDataFilter(this.tableData)
          let chartLabels = []
          let dailyCases = []
          for(let item of filteredData) {
            chartLabels.push(item.date)
            dailyCases.push(item.lst.length)
          }
          this.labels = chartLabels.reverse()
          this.dailyCases = dailyCases.reverse()
          this.totalCases = this.calculateTotal(this.dailyCases)
          console.log('bar charts', this.labels, this.dailyCases, this.totalCases)

          this.chartData = {
            labels: this.labels,
            datasets: [
              {
                type: "line",
                label: "Confirmed cases",
                borderColor: "rgba(255, 0, 0, 0.5)",
                borderWidth: 2,
                fill: false,
                data: this.totalCases
              },
              {
                type: "bar",
                label: "Daily new cases",
                backgroundColor: "rgb(153,153,153)",
                data: this.dailyCases,
                borderColor: "white",
                borderWidth: 2
              }
            ]
          }
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally(() => {
          // always executed
        });
    },
    chartDataFilter(val) {
      const map = {};
      const dest = [];
      let data = JSON.parse(JSON.stringify(val));
      data.forEach(item => {
        if (item.dateofdiagnosis) {
          item.dateofdiagnosis = moment(
            item.dateofdiagnosis.toString()
          ).format("DD MMM");
        }
      });

      data.forEach(item => {
        if (!map[item.dateofdiagnosis]) {
          dest.push({
            date: item.dateofdiagnosis,
            lst: [item]
          });
          map[item.dateofdiagnosis] = item;
        } else {
          dest.forEach(it => {
            if (it.date === item.dateofdiagnosis) {
              it.lst.push(item);
            }
          });
        }
      });
      return [...dest];
    },
    calculateTotal(arr) {
      let result = [];
      let value = 0;
      arr.forEach(item=> {
        value = value + item;
        result.push(value)
      })
      return result
    }
  },
  components: {
    Header,
    Summary,
    LineChart,
    Table,
    Loading
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
