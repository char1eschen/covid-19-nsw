<template>
  <header>
    <h1>NSW Coronavirus (COVID-19) statistics</h1>
    <small>Updated on {{ updatedDate }} AEDT</small>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {};
  },
  props: {
    updatedDate: {
      type: String,
      default: null
    }
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
header {
  padding: 0 15px;
  margin-bottom: 20px;
  text-align: left;
}
h1 {
 font-size: 2.5rem
}
</style>
