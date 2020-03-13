<script>
import { Line } from "vue-chartjs";

export default {
  name: "ComboBarLineChart",
  extends: Line,
  data() {
    return {};
  },
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
// .Chart {
//   background: #212733;
//   border-radius: 15px;
//   box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
//   margin:  25px 0;
// }

// .Chart h2 {
//   margin-top: 0;
//   padding: 15px 0;
//   color:  rgba(255, 0,0, 0.5);
//   border-bottom: 1px solid #323d54;
// }
</style>
