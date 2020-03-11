<template>
  <div id="app">
    <Loading :active.sync="isLoading" 
        :can-cancel="true" 
        :loader="loader"
        :is-full-page="fullPage"></Loading>
    <Header :updatedDate="updatedDate"/>
    <Table :columns="columns" :tableData="tableData" />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Loading from 'vue-loading-overlay';
import Header from "./components/Header.vue";
import Table from "./components/Table.vue";
import 'vue-loading-overlay/dist/vue-loading.css';

const token = "1SCaQqie7igxhaj6fK22oJmkz3xJlw_Snfp3jFqE2JhQ";
export default {
  name: "App",
  data() {
    return {
      isLoading: true,
      loader: 'dots',
      fullPage: true,
      columns: null,
      tableData: [],
      updatedDate: ''
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
          this.isLoading = false
          let columns = []
          let entryData = response.data.feed.entry;
          let updated = response.data.feed.updated;
          // set table data
          entryData.forEach(item => {
            let itemObj = {};
            Object.keys(item).forEach(key => {
              if (key.includes("gsx$")) {
                if (key.substring(4) === "dateofdiagnosis") {
                  itemObj[key.substring(4)] = moment(new Date(item[key]["$t"]));
                } else {
                  itemObj[key.substring(4)] = item[key]["$t"];
                }
              }
            });
            this.tableData.push(itemObj);
          });

          this.updatedDate = moment(updated).format('Do MMM YYYY, hh:mm:ss')
          console.log("updated", this.updatedDate);
          // console.log("response", response);
          // console.log("tableData", tableData);
          
          // set table columns
          if (this.tableData[0]) {
            Object.keys(this.tableData[0]).forEach(key => {
              if (key !== "source") {
                columns.push(key);
              }
            });
          }
          this.columns = columns
          // console.log("columns", this.columns);
          // console.log("tableData", this.tableData);

          // set charts data
          // entryData.forEach(item=> {
          //   console.log('item', item)
          // })
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally(() => {
          // always executed
        });
    }
  },
  components: {
    Header,
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
