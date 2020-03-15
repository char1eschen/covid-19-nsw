<template>
  <div class="share col-xs-12">
    <facebook :url="url" scale="2"></facebook>
    <twitter :url="url" scale="2"></twitter>
    <telegram :url="url" scale="2"></telegram>
    <whats-app :url="url" scale="2"></whats-app>
  </div>
</template>

<script>
import { Facebook, Twitter, Telegram, WhatsApp } from "vue-socialmedia-share";
export default {
  name: "SocialmediaShare",
  components: {
    Facebook,
    Twitter,
    Telegram,
    WhatsApp
  },
  data() {
    return {
      url: "https://char1eschen.github.io/covid-19-nsw"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1,
h2
  font-weight: normal

ul
  list-style-type: none
  padding: 0

li
  display: inline-block
  margin: 0 10px

a
  color: #42b983

.share > span
  float: left
  padding: 1em
</style>
