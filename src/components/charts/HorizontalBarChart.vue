<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  name: "HorizontalBar",
  extends: HorizontalBar,
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
<style scoped lang="stylus"></style>
