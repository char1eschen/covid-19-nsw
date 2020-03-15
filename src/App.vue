<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-10 col-sm-offset-1">
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

          <Summary
            v-if="!isLoading"
            :updatedDate="updatedDate"
            :cases="cases"
            :incrementCases="incrementCases"
            :statistics="statistics"
          />

          <div class="container-fluid panel">
            <div class="row" v-if="!isLoading">
              <PanelHeader class="col-xs-12" panelTitle="Statistics charts" />
              <ComboBarLineChart
                class="col-sm-4 mb-15"
                :chartdata="comboChartData"
                :options="comboChartOptions"
              />
              <ComboBarLineChart
                class="col-sm-4 mb-15"
                :chartdata="statisticsChartData"
                :options="statisticsChartOptions"
              />
              <HorizontalBarChart
                class="col-sm-4 mb-15"
                :chartdata="horizontalbarChartData"
                :options="horizontalbarChartOptions"
              />
            </div>

            <div class="row" v-if="!isLoading">
              <DoughnutChart
                class="col-sm-4 mb-20"
                :chartdata="doughnutChartData"
                :options="doughnutChartOptions"
              />
              <DoughnutChart
                class="col-sm-4 mb-20"
                :chartdata="originChartData"
                :options="originChartOptions"
              />
              <DoughnutChart
                class="col-sm-4 mb-20"
                :chartdata="ageGroupChartData"
                :options="ageGroupChartOptions"
              />
            </div>
          </div>

          <Table v-if="!isLoading" :columns="columns" :tableData="tableData" />

          <Footer v-if="!isLoading" />
        </div>
      </div>
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
import HorizontalBarChart from "./components/charts/HorizontalBarChart";
import Table from "./components/Table.vue";
import Footer from "./components/Footer.vue";
import "vue-loading-overlay/dist/vue-loading.css";
import { chartColors } from "./assets/utils";

const TABLETOKEN = "1SCaQqie7igxhaj6fK22oJmkz3xJlw_Snfp3jFqE2JhQ";
const SUMMARYTOKEN = "1rvShbFWteDikTBV6tZaA7TWY2xQrTzB-mSqFJoXcFAc";

export default {
  name: "App",
  data() {
    return {
      summaryDataLoading: true,
      tableDataLoading: true,
      loader: "dots",
      fullPage: true,
      statistics: null,
      columns: null,
      tableData: [],
      updatedDate: "",
      cases: null,
      incrementCases: null,
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
          text: "Gender statistics"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let allData = data.datasets[tooltipItem.datasetIndex].data;
              let tooltipLabel = data.labels[tooltipItem.index];
              let tooltipData = allData[tooltipItem.index];
              let total = 0;
              for (let i in allData) {
                total += parseFloat(allData[i]);
              }
              let tooltipPercentage = Math.round((tooltipData / total) * 100);
              return (
                tooltipLabel +
                ": " +
                tooltipData +
                " (" +
                tooltipPercentage +
                "%)"
              );
            }
          }
        }
      },
      horizontalbarChartData: null,
      horizontalbarChartOptions: {
        responsive: true,
        legend: {
          display: false,
          position: "top"
        },
        title: {
          display: true,
          text: "Overseas acquired cases"
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let allData = data.datasets[tooltipItem.datasetIndex].data;
              let tooltipLabel = data.labels[tooltipItem.index];
              let tooltipData = allData[tooltipItem.index];
              let total = 0;
              for (let i in allData) {
                total += parseFloat(allData[i]);
              }
              let tooltipPercentage = Math.round((tooltipData / total) * 100);
              return (
                tooltipLabel +
                ": " +
                tooltipData +
                " (" +
                tooltipPercentage +
                "%)"
              );
            }
          }
        }
      },
      statisticsChartData: null,
      statisticsChartOptions: {
        responsive: true,
        title: {
          display: true,
          text: "Under investigation and excluded cases (Last 21 days)"
        },
        tooltips: {
          mode: "index",
          intersect: true
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left"
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            gridLines: {
              drawOnChartArea: false
            }
          }
        }
      },
      ageGroupChartData: null,
      ageGroupChartOptions: {
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: "Age group statistics"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let allData = data.datasets[tooltipItem.datasetIndex].data;
              let tooltipLabel = data.labels[tooltipItem.index];
              let tooltipData = allData[tooltipItem.index];
              let total = 0;
              for (let i in allData) {
                total += parseFloat(allData[i]);
              }
              let tooltipPercentage = Math.round((tooltipData / total) * 100);
              return (
                tooltipLabel +
                ": " +
                tooltipData +
                " (" +
                tooltipPercentage +
                "%)"
              );
            }
          }
        }
      },
      originChartData: null,
      originChartOptions: {
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: "Source statistics"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let allData = data.datasets[tooltipItem.datasetIndex].data;
              let tooltipLabel = data.labels[tooltipItem.index];
              let tooltipData = allData[tooltipItem.index];
              let total = 0;
              for (let i in allData) {
                total += parseFloat(allData[i]);
              }
              let tooltipPercentage = Math.round((tooltipData / total) * 100);
              return (
                tooltipLabel +
                ": " +
                tooltipData +
                " (" +
                tooltipPercentage +
                "%)"
              );
            }
          }
        }
      }
    };
  },
  mounted() {
    this.getSummaryData();
    this.getData();
  },
  computed: {
    isLoading: function() {
      return this.summaryDataLoading || this.tableDataLoading;
    }
  },
  methods: {
    getData() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${TABLETOKEN}/od6/public/values?alt=json`
        )
        .then(response => {
          let columns = [];
          let entryData = response.data.feed.entry;
          // let updated = response.data.feed.updated["$t"];

          // table data
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
          // this.updatedDate = moment(updated).format("Do MMM YYYY, hh:mm:ss");

          // table columns
          if (this.tableData[0]) {
            this.updatedDate = this.tableData[0].dateofdiagnosis.format(
              "Do MMM YYYY"
            );
            Object.keys(this.tableData[0]).forEach(key => {
              if (key !== "source") {
                columns.push(key);
              }
            });
          }
          this.columns = columns;

          // summary data
          let cases = {
            total: this.tableData.length,
            confirmed: 0,
            recovered: 0,
            death: 0
          };
          let previousDayData = [];
          this.tableData.map(item => {
            if (
              this.tableData[0].dateofdiagnosis.isSame(
                item.dateofdiagnosis,
                "day"
              )
            ) {
              previousDayData.push(item);
            }
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

          // previous day compare
          let incrementCases = {
            total: previousDayData.length,
            confirmed: 0,
            recovered: 0,
            death: 0
          };
          previousDayData.map(item => {
            switch (item.status) {
              case "Confirmed":
                incrementCases.confirmed++;
                break;
              case "Recovered":
                incrementCases.recovered++;
                break;
              case "Death":
                incrementCases.death++;
                break;
            }
          });
          this.incrementCases = incrementCases;

          // total confirmed cases and daily new cases chart
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
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderWidth: 2,
                fill: false,
                data: this.totalCases
              },
              {
                type: "bar",
                label: "Daily new cases",
                backgroundColor: chartColors.darkGrey,
                borderColor: "white",
                borderWidth: 2,
                data: this.dailyCases
              }
            ]
          };

          // source chart & source statistics
          let overseasChartData = this.chartDataFilter(
            this.tableData,
            "origin",
            "origin"
          );
          let overseasLabels = [];
          let countryData = [];
          for (let item of overseasChartData) {
            if (
              item.origin !== "Contacts" &&
              item.origin !== "Unknown" &&
              item.origin !== "Investigating"
            ) {
              overseasLabels.push(item.origin);
              countryData.push(item.lst.length);
            }
          }
          this.horizontalbarChartData = {
            labels: overseasLabels,
            datasets: [
              {
                label: "Comfirmed cases",
                backgroundColor: chartColors.darkGrey,
                borderColor: "white",
                borderWidth: 2,
                data: countryData
              }
            ]
          };

          let originChartLabels = [
            "Overseas",
            "Contacts",
            "Investigating",
            "Unknown"
          ];
          // todo edit source chart datavhere
          let originChartData = [60, 40, 23, 13];
          // let originChartData = [this.sum(countryData), 0, 0, 0];
          // for (let item of overseasChartData) {
          //   if (item.origin === "Contacts") {
          //     originChartData[1] = item.lst.length;
          //   } else if (item.origin === "Investigating") {
          //     originChartData[2] = item.lst.length;
          //   } else if (item.origin === "Unknown") {
          //     originChartData[3] = item.lst.length;
          //   }
          // }

          this.originChartData = {
            datasets: [
              {
                data: originChartData,
                backgroundColor: [
                  chartColors.red,
                  chartColors.orange,
                  chartColors.blue
                ]
              }
            ],
            labels: originChartLabels
          };

          // gender statistics
          let genderData = this.chartDataFilter(
            this.tableData,
            "gender",
            "gender"
          );
          let genderChartLabels = ["Male", "Female"];
          let genderChartData = [];
          for (let item of genderData) {
            if (item.gender === genderChartLabels[0]) {
              genderChartData[0] = item.lst.length;
            } else if (item.gender === genderChartLabels[1]) {
              genderChartData[1] = item.lst.length;
            }
          }
          this.doughnutChartData = {
            datasets: [
              {
                data: genderChartData,
                backgroundColor: [chartColors.blue, chartColors.red]
              }
            ],
            labels: genderChartLabels
          };

          // age group statistics
          let ageData = JSON.parse(JSON.stringify(this.tableData));
          let ageMap = {
            "0s": 0,
            "10s": 0,
            "20s": 0,
            "30s": 0,
            "40s": 0,
            "50s": 0,
            "60s": 0,
            "70s": 0,
            "80s": 0,
            "90s": 0
          };
          let ageGroupChartData = [];
          let ageGroutChartLabels = [];
          ageData.forEach(item => {
            if (item.age.includes("s")) {
              item.age = parseInt(item.age.replace(/s/gi, ""));
            } else {
              item.age = parseInt(item.age);
            }
            if (item.age < 10) {
              ageMap["0s"]++;
            } else {
              let key = parseInt((item.age % 100) / 10) * 10 + "s";
              ageMap[key]++;
            }
          });
          for (let key in ageMap) {
            ageGroupChartData.push(ageMap[key]);
            ageGroutChartLabels.push(key);
          }
          this.ageGroupChartData = {
            datasets: [
              {
                data: ageGroupChartData,
                backgroundColor: [
                  chartColors.yellow,
                  chartColors.orange,
                  chartColors.red,
                  chartColors.darkRed,
                  chartColors.green,
                  chartColors.blue,
                  chartColors.darkBlue,
                  chartColors.purple,
                  chartColors.grey,
                  chartColors.darkGrey
                ]
              }
            ],
            labels: ageGroutChartLabels
          };

          this.tableDataLoading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally(() => {
          // always executed
        });
    },
    getSummaryData() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${SUMMARYTOKEN}/od6/public/values?alt=json`
        )
        .then(response => {
          let entryData = response.data.feed.entry;
          let summaryData = [];
          // under investigation and excluded cases
          entryData.forEach(item => {
            let itemObj = {};
            Object.keys(item).forEach(key => {
              if (key.includes("gsx$")) {
                if (key.substring(4) === "date") {
                  itemObj[key.substring(4)] = moment(
                    item[key]["$t"],
                    "DD/MM/YYYY"
                  )
                    .format("DD MMM")
                    .toString();
                } else {
                  itemObj[key.substring(4)] = parseInt(item[key]["$t"]);
                }
              }
            });
            summaryData.push(itemObj);
          });
          this.statistics = summaryData.splice(-2);
          let underinvestigation = [];
          let excluded = [];
          let summaryLabels = [];
          summaryData.forEach(item => {
            this.addValToArr(item.underinvestigation, underinvestigation);
            this.addValToArr(item.testedandexcluded, excluded);
            this.addValToArr(item.date, summaryLabels);
          });
          this.statisticsChartData = {
            labels: summaryLabels.slice(-21),
            datasets: [
              {
                type: "line",
                label: "Excluded cases",
                borderColor: chartColors.blue,
                borderWidth: 2,
                backgroundColor: "rgba(0, 0, 0, 0)",
                fill: false,
                data: excluded.slice(-21),
                yAxisID: "y"
              },
              {
                type: "bar",
                label: "Investigating cases",
                backgroundColor: chartColors.darkGrey,
                data: underinvestigation.slice(-21),
                yAxisID: "y1"
              }
            ]
          };
          this.summaryDataLoading = false;
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
    addValToArr(val, arr) {
      if (val) {
        arr.push(val);
      } else {
        arr.push(null);
      }
    },
    sum(arr) {
      return arr.reduce(function(prev, curr) {
        return prev + curr;
      });
    }
  },
  components: {
    Header,
    PanelHeader,
    Summary,
    ComboBarLineChart,
    DoughnutChart,
    HorizontalBarChart,
    Table,
    Footer,
    Loading
  }
};
</script>

<style lang="stylus">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.panel {
  position: relative;
  background: #f9f9f9;
  margin: 0 0 25px 0;
  border: none;
  padding: 0 20px;
  box-shadow: 0 0 6px 0 rgba(0,0,0,.2);
  border-radius: 4px;
}
hr
  margin-top: 10px
.mb-15
  margin-bottom: 15px

.mb-20
  margin-bottom: 20px
.mt-10
  margin-top: 10px
</style>
