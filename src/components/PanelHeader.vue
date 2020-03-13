<template>
  <div class="panelHeader">
    <div class="row">
      <div class="col-xs-12">
        <h2>{{ panelTitle }}</h2>
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PanelHeader",
  data() {
    return {};
  },
  props: {
    panelTitle: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.panelHeader
  float: left
  h2
    font-size: 2rem
    text-align: initial
</style>
