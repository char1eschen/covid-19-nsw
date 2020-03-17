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

          <div class="container-fluid panel" v-if="!isLoading">
            <PanelHeader panelTitle="Statistics charts" />

            <div class="row">
              <div class="col-xs-12 no-gutter">
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
                <DoughnutChart
                  class="col-sm-4 mb-20"
                  :chartdata="agegroupChartData"
                  :options="ageGroupChartOptions"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-xs-12 no-gutter">
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
                <HorizontalBarChart
                  class="col-sm-4 mb-15"
                  :chartdata="horizontalbarChartData"
                  :options="horizontalbarChartOptions"
                />
              </div>
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
import { chartColors, token } from "./assets/js/utils";

export default {
  name: "App",
  data() {
    return {
      summaryDataLoading: true,
      tableDataLoading: true,
      agegroupLoading: true,
      sourceLoading: true,
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
          text: "Total confirmed cases, daily new cases & growth rate"
        },
        tooltips: {
          mode: "index",
          intersect: true,
          callbacks: {
            label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || "";

              if (label) {
                label += `: ${tooltipItem.value}`;
              }
              if (tooltipItem.datasetIndex === 1) {
                label += "%";
              }
              return label;
            }
          }
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
            ticks: {
              callback: function(value) {
                return value + "%";
              }
            },
            gridLines: {
              drawOnChartArea: false
            }
          }
        }
      },
      doughnutChartData: null,
      doughnutChartOptions: {
        responsive: true,
        legend: {
          // display: false
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
          text: "Overseas acquired cases (updated on 15 Mar)"
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
          text: "Under investigation & excluded cases (Last 21 days)"
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
      agegroupChartData: null,
      ageGroupChartOptions: {
        responsive: true,
        legend: {
          // display: false
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
          // display: false
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
    this.getAgegroupData();
    this.getSummaryData();
    this.getSourceData();
    this.getData();
  },
  computed: {
    isLoading: function() {
      return (
        this.summaryDataLoading ||
        this.tableDataLoading ||
        this.agegroupLoading ||
        this.sourceLoading
      );
    }
  },
  methods: {
    getData() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${token.table}/od6/public/values?alt=json`
        )
        .then(response => {
          let columns = [];
          let entryData = response.data.feed.entry;

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
          let growthRate = [];
          for (let item of comboChartData) {
            chartLabels.push(item.date);
            dailyCases.push(item.lst.length);
          }
          this.labels = chartLabels.reverse();
          this.dailyCases = dailyCases.reverse();
          this.totalCases = this.calculateTotal(this.dailyCases);
          for (let i = 0; i < this.dailyCases.length; i++) {
            let rate = (
              (this.dailyCases[i] / this.totalCases[i - 1]) *
              100
            ).toFixed(2);
            if (!isNaN(rate)) {
              growthRate.push(rate);
            } else {
              growthRate.push(0);
            }
          }
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
                data: this.totalCases,
                yAxisID: "y"
              },
              {
                type: "line",
                label: "Growth rate",
                borderColor: chartColors.blue,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderWidth: 2,
                fill: false,
                data: growthRate,
                yAxisID: "y1"
              },
              {
                type: "bar",
                label: "Daily new cases",
                backgroundColor: chartColors.darkGrey,
                // borderColor: "transparent",
                // borderWidth: 1,
                data: this.dailyCases,
                yAxisID: "y"
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
                borderColor: "transparent",
                borderWidth: 1,
                data: countryData
              }
            ]
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
          `https://spreadsheets.google.com/feeds/list/${token.summary}/od6/public/values?alt=json`
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
                // borderColor: "transparent",
                // borderWidth: 1,
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
    getAgegroupData() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${token.agegroup}/od6/public/values?alt=json`
        )
        .then(response => {
          let entryData = response.data.feed.entry;
          let rawData = [];
          // get agegroup and gender data
          this.dataFormat(entryData, "agegroup", rawData);
          // agegroup statistics
          let agegroup = rawData.splice(0, rawData.length - 1);
          let agegroupLabels = [];
          let agegroupData = [];
          agegroup.forEach(item => {
            agegroupLabels.push(item.agegroup);
            agegroupData.push(item.total);
          });
          this.agegroupChartData = {
            datasets: [
              {
                data: agegroupData,
                borderColor: "#f9f9f9",
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
            labels: agegroupLabels
          };

          // gender statistics
          let gender = rawData[rawData.length - 1];
          this.doughnutChartData = {
            datasets: [
              {
                borderColor: "#f9f9f9",
                // data: genderChartData,
                data: [gender.female, gender.male],
                backgroundColor: [chartColors.red, chartColors.blue]
              }
            ],
            labels: ["Female", "Male"]
          };

          this.agegroupLoading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally(() => {
          // always executed
        });
    },
    getSourceData() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${token.source}/od6/public/values?alt=json`
        )
        .then(response => {
          let entryData = response.data.feed.entry;
          let rawData = [];
          // get agegroup and gender data
          this.dataFormat(entryData, "source", rawData);
          // source statistics
          let sourceLabels = [];
          let sourceData = [];
          rawData.forEach(item => {
            sourceLabels.push(item.source);
            sourceData.push(item.count);
          });
          this.originChartData = {
            datasets: [
              {
                data: sourceData,
                borderColor: "#f9f9f9",
                backgroundColor: [
                  chartColors.red,
                  chartColors.orange,
                  chartColors.blue
                ]
              }
            ],
            labels: sourceLabels
          };

          this.sourceLoading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally(() => {
          // always executed
        });
    },
    dataFormat(entryData, column, rawData) {
      entryData.forEach(item => {
        let itemObj = {};
        Object.keys(item).forEach(key => {
          if (key.includes("gsx$")) {
            if (key.substring(4) === column) {
              itemObj[key.substring(4)] = item[key]["$t"];
            } else {
              itemObj[key.substring(4)] = parseInt(item[key]["$t"]);
            }
          }
        });
        rawData.push(itemObj);
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
.no-gutter {
  padding-right: 0;
  padding-left: 0;
}

.mb-15 {
  margin-bottom: 15px;
}

.mb-20 {
  margin-bottom: 20px;
}

.mt-10 {
  margin-top: 10px;
}

body {
  background: #dceefc;
}

hr {
  margin-top: 10px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

/* * Panel * */
.panel {
  position: relative;
  background: #f9f9f9;
  margin: 0 0 25px 0;
  border: none;
  padding: 0 20px;
  box-shadow: 2px 2px 4px rgba(56, 53, 45, 0.3), -2px -4px 4px hsla(0, 0%, 100%, 0.5), inset 1px 1px 1px rgba(224, 234, 249, 0.5);
  border-radius: 10px;
  overflow: hidden;
}

/* * Vue Tables * */
.VueTables .row {
  margin: 0;
}

/* * Pagination * */
.pagination {
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 0;
  margin: 25px 0 10px 0;

  li {
    list-style: none;
    float: none;
    display: inline-block;
    font-size: 14px;
    margin: 0;

    a {
      cursor: pointer;
      margin: 0;
      padding: 0;
      border: none;
      border-left: none;
      color: rgb(44, 62, 80);
      opacity: 0.5;
      width: 24px;
      height: 30px;
      line-height: 30px;
      background: none;

      &:hover, &:focus {
        border: none;
        border-left: none;
        background: none;
        color: rgb(44, 62, 80);
        opacity: 1;
      }
    }

    &.disabled {
      background: none;

      a {
        background: none;
      }
    }

    &.VuePagination__pagination-item-prev-chunk, &.VuePagination__pagination-item-next-chunk {
      display: none;
    }

    &.VuePagination__pagination-item-prev-page, &.VuePagination__pagination-item-next-page {
      a {
        overflow: hidden;
        line-height: 200px;
        position: relative;
        background: none;

        &:before {
          content: '';
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          line-height: 30px;
          display: block;
          position: absolute;
        }
      }
    }

    &.VuePagination__pagination-item-prev-page {
      a {
        border-left: none;

        &:before {
          content: '<';
        }

        &:hover, &:focus {
          border-left: none;
          background: none;
        }
      }
    }

    &.VuePagination__pagination-item-next-page {
      a {
        border-left: none;

        &:before {
          content: '>';
        }

        &:hover, &:focus {
          background: none;
        }
      }
    }

    &.active {
      a {
        background: none;
        border: none;
        color: rgb(44, 62, 80);
        opacity: 1;

        &:hover, &:focus {
          background: none;
          border: none;
          color: rgb(44, 62, 80);
        }
      }
    }
  }
}

.VuePagination__count {
  font-size: 12px;
  margin: 0 auto 20px auto;
}
</style>
