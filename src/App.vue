<template>
  <div id="app">
    <div class="container-fluid">
      <Loading
        :active.sync="isLoading"
        :can-cancel="true"
        :loader="loader"
        :is-full-page="fullPage"
      />

      <div class="row">
        <Header
          class="col-xs-12"
          v-if="!isLoading"
          :updatedDate="updatedDate"
        />
      </div>

      <Summary v-if="!isLoading" :cases="cases" />

      <div class="row" v-if="!isLoading">
        <PanelHeader panelTitle="Trending charts" />
        <ComboBarLineChart
          class="col-md-4"
          :chartdata="comboChartData"
          :options="comboChartOptions"
        />
        <BarChart
          class="col-md-4"
          :chartdata="barChartData"
          :options="barChartOptions"
        />
        <DoughnutChart
          class="col-md-4"
          :chartdata="doughnutChartData"
          :options="doughnutChartOptions"
        />
      </div>

      <Table v-if="!isLoading" :columns="columns" :tableData="tableData" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Loading from "vue-loading-overlay";
import Header from "./components/Header.vue";
import PanelHeader from "./components/PanelHeader.vue";
import Summary from "./components/Summary.vue";
import ComboBarLineChart from "./components/charts/ComboBarLineChart";
import DoughnutChart from "./components/charts/DoughnutChart";
import BarChart from "./components/charts/BarChart";
import Table from "./components/Table.vue";
import "vue-loading-overlay/dist/vue-loading.css";
import { default as chartColors } from "./assets/utils";

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
      comboChartData: null,
      comboChartOptions: {
        responsive: true,
        title: {
          display: true,
          text: "Total confirmed cases and daily new cases"
        },
        tooltips: {
          mode: "index",
          intersect: true
        }
      },
      doughnutChartData: null,
      doughnutChartOptions: {
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: "Chart.js Doughnut Chart"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: false,
          position: "top"
        },
        title: {
          display: true,
          text: "Chart.js Bar Chart"
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

          // for combo bar-line chart
          let comboChartData = this.chartDataFilter(
            this.tableData,
            "dateofdiagnosis",
            "date"
          );
          let chartLabels = [];
          let dailyCases = [];
          for (let item of comboChartData) {
            chartLabels.push(item.date);
            dailyCases.push(item.lst.length);
          }
          this.labels = chartLabels.reverse();
          this.dailyCases = dailyCases.reverse();
          this.totalCases = this.calculateTotal(this.dailyCases);
          this.comboChartData = {
            labels: this.labels,
            datasets: [
              {
                type: "line",
                label: "Confirmed cases",
                borderColor: chartColors.red,
                borderWidth: 2,
                fill: false,
                // yAxisID: 'left',
                data: this.totalCases
              },
              {
                type: "bar",
                label: "Daily new cases",
                backgroundColor: chartColors.darkGrey,
                borderColor: "white",
                borderWidth: 2,
                // yAxisID: 'right',
                data: this.dailyCases
              }
            ]
          };

          // for doughnut chart
          let doughnutChartData = this.chartDataFilter(
            this.tableData,
            "originate",
            "originate"
          );
          let doughnutLabels = [];
          let countryData = [];
          let doughnutBackground = [];
          for (let item of doughnutChartData) {
            if (item.originate !== "Local" && item.originate !== "Unknown") {
              doughnutLabels.push(item.originate);
              countryData.push(item.lst.length);
              doughnutBackground.push(this.dynamicColors());
            }
          }
          console.log(
            "doughnutChartData",
            doughnutLabels,
            countryData,
            doughnutBackground
          );
          this.barChartData = {
            labels: doughnutLabels,
            datasets: [
              {
                label: "Dataset 1",
                backgroundColor: chartColors.darkGrey,
                borderColor: "white",
                borderWidth: 2,
                data: countryData
              }
            ]
          };
          this.doughnutChartData = {
            datasets: [
              {
                data: countryData,
                backgroundColor: doughnutBackground,
                label: "Dataset 1"
              }
            ],
            labels: doughnutLabels
          };
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally(() => {
          // always executed
        });
    },
    chartDataFilter(val, key, newKey) {
      const map = {};
      const dest = [];
      let data = JSON.parse(JSON.stringify(val));
      // if lable is date, covert format
      if (key === "dateofdiagnosis") {
        data.forEach(item => {
          if (item[key]) {
            item[key] = moment(item[key].toString()).format("DD MMM");
          }
        });
      }

      data.forEach(item => {
        if (!map[item[key]]) {
          dest.push({
            [newKey]: item[key],
            lst: [item]
          });
          map[item[key]] = item;
        } else {
          dest.forEach(it => {
            if (it[newKey] === item[key]) {
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
      arr.forEach(item => {
        value = value + item;
        result.push(value);
      });
      return result;
    },
    dynamicColors() {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  },
  components: {
    Header,
    PanelHeader,
    Summary,
    ComboBarLineChart,
    DoughnutChart,
    BarChart,
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
