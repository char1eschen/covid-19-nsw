<template>
  <header class="bg">
    <h1>NSW Coronavirus (COVID-19) statistics</h1>
    <small>Updated on {{ updatedDate }}</small>
    <SocialmediaShare />
  </header>
</template>

<script>
import SocialmediaShare from "./SocialmediaShare.vue";

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
  methods: {},
  components: {
    SocialmediaShare
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
header {
  padding: 0 15px;
  // margin-bottom: 20px;
  text-align: left;
}

h1 {
  font-size: 2.5rem;
}

.bg {
  /* The image used */
  background-image: url('../assets/images/banner.png');
  /* Full height */
  height: 100%;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
