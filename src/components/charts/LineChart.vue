<script>
import { Line } from "vue-chartjs";

export default {
  name: "ComboBarLineChart",
  extends: Line,
  data() {
    return {
      // gradient: null,
      // gradient2: null
    };
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
  // watch: {
  //   chartdata: {
  //     deep: true,
  //     handler(newVal, oldVal) {

  //     }
  //   }
  // },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.renderChart(this.chartdata, this.options);
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.Chart {
      background: #212733;
      border-radius: 15px;
      box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
      margin:  25px 0;
    }

    .Chart h2 {
      margin-top: 0;
      padding: 15px 0;
      color:  rgba(255, 0,0, 0.5);
      border-bottom: 1px solid #323d54;
    }
</style>
